<template>
  <v-app class="app" style="z-index: 0" full-height>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>Generator opłatków</v-app-bar-title>
      <template v-slot:append>
        <v-btn @click="openModal">Ostatnie</v-btn>
        <v-btn @click="saveFile">Zapisz</v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer width="300" permanent>
      <v-list>
        <v-list-item class="my-4">
          <type-selector v-model="type" />
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="mt-4">
          <image-selector @selected="onImageSelected" />
        </v-list-item>
        <v-list-item class="mb-4">
          <crop-image-selector :wafer-type="type" @selected="onImageSelected" />
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="my-4">
          <filters v-model:filters="imageFilters" />
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="my-4">
          <div class="app__summary">
            <v-text-field
              class="mb-4"
              v-if="
                type === WaferType.Circle ||
                type === WaferType.CircleWithMiniatures
              "
              label="Średnica"
              max="200"
              min="100"
              v-model.number="renderOptions.radius"
              type="number"
              variant="outlined"
            />

            <v-text-field
              class="mb-4"
              v-if="
                type === WaferType.Circle ||
                type === WaferType.CircleWithMiniatures
              "
              label="Margines góra"
              min="5"
              max="50"
              v-model.number="renderOptions.marginTop"
              type="number"
              variant="outlined"
            />

            <v-text-field
              class="mb-4"
              v-if="
                type === WaferType.RectangleLandsape ||
                type === WaferType.RectanglePortrait
              "
              label="Margines"
              type="number"
              min="0"
              max="30"
              v-model.number="renderOptions.margin"
              variant="outlined"
            />

            <v-btn
              class="app__generate-btn"
              variant="outlined"
              :disabled="pending"
              @click="generatePdf"
              size="large"
            >
              Generuj PDF
            </v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer width="420" permanent position="right">
      <textboxes-list v-model="textsOptions" />
    </v-navigation-drawer>
    <v-main>
      <fabric-canvas
        :options="canvasOptions"
        class="rounded elevation-4"
        ref="canvasRef"
      >
        <fabric-image
          :image="image"
          v-model:options="imageOptions"
          :filters="imageFilters"
        />
        <fabric-textbox
          v-for="(textOption, index) in textsOptions"
          :key="index"
          v-model:options="textsOptions[index]"
        />
      </fabric-canvas>
    </v-main>
    <projects-dialog
      ref="projectsDialog"
      @restore="restoreProject"
    ></projects-dialog>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch } from "vue";
import FabricCanvas from "@/components/fabric/FabricCanvas.vue";
import FabricTextbox from "@/components/fabric/FabricTextbox.vue";
import FabricImage from "@/components/fabric/FabricImage.vue";
import TextboxesList from "@/components/wafer/TextboxesList.vue";
import ImageSelector from "@/components/wafer/ImageSelector.vue";
import CropImageSelector from "@/components/wafer/CropImageSelector.vue";
import TypeSelector from "@/components/wafer/TypeSelector.vue";
import Filters from "@/components/wafer/Filters.vue";
import ProjectsDialog from "@/components/wafer/ProjectsDialog.vue";
import fabric from "@/fabric";
import {
  DEFAULT_TEXT_OPTIONS,
  DEFAULT_CANVAS_SIZE,
  A4_SIZE_RATIO,
} from "@/constants";
import { WaferType } from "@/enums";
import PdfRenderer from "@/pdfRenderer";
import { FileSystemDirectoryHandle } from "@/fileAccess";
import Project from "@/types/project";
fabric.textureSize = 4096;

const getSizeByWaferType = (
  type: WaferType
): { width: number; height: number } => {
  const shortestSide = DEFAULT_CANVAS_SIZE;
  const longestSide = DEFAULT_CANVAS_SIZE * A4_SIZE_RATIO;
  return {
    [WaferType.Circle]: { width: shortestSide, height: shortestSide },
    [WaferType.CircleWithMiniatures]: {
      width: shortestSide,
      height: shortestSide,
    },
    [WaferType.RectangleLandsape]: { width: longestSide, height: shortestSide },
    [WaferType.RectanglePortrait]: { width: shortestSide, height: longestSide },
  }[type];
};

const canvasOptions = ref<fabric.ICanvasOptions>({
  width: DEFAULT_CANVAS_SIZE,
  height: DEFAULT_CANVAS_SIZE,
  preserveObjectStacking: true,
});

const imageOptions = ref<fabric.IImageOptions>({
  width: DEFAULT_CANVAS_SIZE,
  height: DEFAULT_CANVAS_SIZE,
});

const imageFilters = shallowRef<fabric.IBaseFilter[]>([]);

const textsOptions = ref<fabric.ITextboxOptions[]>([
  { ...DEFAULT_TEXT_OPTIONS },
]);

const renderOptions = ref({
  radius: 200,
  marginTop: 20,
  margin: 5,
});

const image = ref<HTMLImageElement | null>(null);
const type = ref<WaferType>(WaferType.Circle);

const canvasRef = ref<{
  toDataImage: () => HTMLImageElement;
  toDataUrl: () => string;
} | null>(null);
watch(type, () => {
  const size = getSizeByWaferType(type.value);
  canvasOptions.value.width = size.width;
  canvasOptions.value.height = size.height;
});

const onImageSelected = (imageElement: HTMLImageElement) => {
  imageOptions.value = {
    scaleX: (canvasOptions.value.width || 0) / imageElement.width,
    scaleY: (canvasOptions.value.width || 0) / imageElement.width,
    width: imageElement.width,
    height: imageElement.height,
    selectable: true,
  };
  image.value = imageElement;
};

const pending = ref(false);

const generatePdf = async () => {
  pending.value = true;
  try {
    const renderer = new PdfRenderer(
      type.value === WaferType.RectangleLandsape ? "landscape" : "portrait"
    );
    const canvasImage = await canvasRef.value?.toDataImage();
    if (!canvasImage)
      throw Error("Pdf cannot be rendered. Image should be provided.");

    switch (type.value) {
      case WaferType.Circle:
        renderer.addCircleImage(canvasImage, renderOptions.value);
        break;
      case WaferType.CircleWithMiniatures:
        renderer.addCircleImage(canvasImage, renderOptions.value);
        renderer.addMinatures(canvasImage);
        break;
      case WaferType.RectangleLandsape:
        renderer.addRectangleLandscapeImage(canvasImage, renderOptions.value);
        break;
      case WaferType.RectanglePortrait:
        renderer.addRectanglePortraitImage(canvasImage, renderOptions.value);
        break;
    }
    renderer.save();
  } finally {
    pending.value = false;
  }
};

function getDataUrl(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx?.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg");
}

const directoryAccess = shallowRef<FileSystemDirectoryHandle | null>(null);
const saveFile = async () => {
  if (directoryAccess.value === null)
    directoryAccess.value = await window.showDirectoryPicker();

  const fileHandle = await directoryAccess.value.getFileHandle(
    `${Date.now().toString()}.json`,
    {
      create: true,
    }
  );

  const writable = await fileHandle.createWritable();
  await writable.write(
    JSON.stringify(
      {
        textsOptions: textsOptions.value,
        renderOptions: renderOptions.value,
        imageOptions: imageOptions.value,
        type: type.value,
        canvasOptions: canvasOptions.value,
        image: image.value !== null ? getDataUrl(image.value) : null,
        previewImage: canvasRef.value?.toDataUrl(),
        filters: imageFilters.value.map((f) => f.toObject()),
      },
      null,
      2
    )
  );
  await writable.close();
};

const restoreProject = async (project: Project) => {
  const filtersDict: Record<string, (object: unknown) => fabric.IBaseFilter> = {
    Brightness: (object: unknown) =>
      fabric.Image.filters.Brightness.fromObject(object),
    Saturation: (object: unknown) =>
      fabric.Image.filters.Saturation.fromObject(object),
    Contrast: (object: unknown) =>
      fabric.Image.filters.Contrast.fromObject(object),
  };

  type.value = project.type;
  textsOptions.value = project.textsOptions;
  renderOptions.value = project.renderOptions;
  canvasOptions.value = project.canvasOptions;
  imageFilters.value = project.filters.map((f) => filtersDict[f.type](f));
  const newImage = new Image();
  newImage.src = project.image;
  newImage.onload = () => {
    onImageSelected(newImage);
  };
  document.body.appendChild(newImage);
};

const projectsDialog = ref<{
  openDialog: (directoryAccess: FileSystemDirectoryHandle) => void;
} | null>(null);
const openModal = async () => {
  if (directoryAccess.value === null)
    directoryAccess.value = await window.showDirectoryPicker();

  projectsDialog.value?.openDialog(directoryAccess.value);
};
</script>

<style lang="scss">
.app {
  &__summary {
    width: 100%;
  }
  &__generate-btn {
    width: 100%;
  }

  .v-main__wrap {
    min-height: 100vh;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
}
</style>
