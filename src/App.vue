<template>
  <v-app style="z-index: 0" full-height>
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
          <filters @update:filters="imageFilters = $event" />
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="my-4">
          <div style="width: 100%">
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
            />

            <v-btn
              variant="outlined"
              :disabled="pending"
              @click="generatePdf"
              style="width: 100%"
            >
              Generuj PDF
            </v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer width="420" permanent position="right">
      <textboxes-list v-model:options="textsOptions" />
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
  </v-app>
</template>

<script lang="ts" setup>
import { reactive, ref, shallowRef, watch } from "vue";
import FabricCanvas from "@/components/fabric/FabricCanvas.vue";
import FabricTextbox from "@/components/fabric/FabricTextbox.vue";
import FabricImage from "@/components/fabric/FabricImage.vue";
import TextboxesList from "@/components/wafer/TextboxesList.vue";
import ImageSelector from "@/components/wafer/ImageSelector.vue";
import CropImageSelector from "@/components/wafer/CropImageSelector.vue";
import TypeSelector from "@/components/wafer/TypeSelector.vue";
import Filters from "@/components/wafer/Filters.vue";

import fabric from "@/fabric";
import {
  DEFAULT_TEXT_OPTIONS,
  DEFAULT_CANVAS_SIZE,
  A4_SIZE_RATIO,
} from "@/constants";
import { WaferType } from "@/enums";
import PdfRenderer from "@/pdfRenderer";

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

const imageFilters = shallowRef([]);

const textsOptions = ref<fabric.ITextboxOptions[]>([
  { ...DEFAULT_TEXT_OPTIONS },
]);

const renderOptions = reactive({
  radius: 200,
  marginTop: 20,
  margin: 5,
});

const image = ref<HTMLImageElement | null>(null);
const type = ref<WaferType>(WaferType.Circle);

const canvasRef = ref<{
  toDataImage: () => HTMLImageElement;
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
        renderer.addCircleImage(canvasImage, renderOptions);
        break;
      case WaferType.CircleWithMiniatures:
        renderer.addCircleImage(canvasImage, renderOptions);
        renderer.addMinatures(canvasImage);
        break;
      case WaferType.RectangleLandsape:
        renderer.addRectangleLandscapeImage(canvasImage, renderOptions);
        break;
      case WaferType.RectanglePortrait:
        renderer.addRectanglePortraitImage(canvasImage, renderOptions);
        break;
    }
    renderer.save();
  } finally {
    pending.value = false;
  }
};
</script>

<style lang="scss">
.v-main__wrap {
  min-height: 100vh;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
