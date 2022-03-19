<template>
  <section class="section is-small">
    <div
      class="is-flex is-justify-content-space-between is-align-content-start"
    >
      <div>
        <div class="box">
          <type-selector v-model="type" />
          <image-selector class="mt-4" @selected="onImageSelected" />
          <crop-image-selector
            class="mt-4"
            :wafer-type="type"
            @selected="onImageSelected"
          />
        </div>

        <div class="box">
          <filters @update:filters="imageFilters = $event" />
        </div>

        <div class="box">
          <input-base
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

          <input-base
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

          <input-base
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

          <button
            class="button is-primary is-fullwidth mt-4"
            :disabled="pending"
            @click="generatePdf"
          >
            <i class="fas fa-file-pdf mr-2"></i>
            Generuj PDF
          </button>
        </div>
      </div>

      <div>
        <div class="box">
          <fabric-canvas
            :options="canvasOptions"
            class="wafer-canvas"
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
        </div>
      </div>

      <div class="ml-4">
        <textboxes-list v-model:options="textsOptions" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, shallowRef, watch } from "vue";
import FabricCanvas from "@/components/fabric/FabricCanvas.vue";
import FabricTextbox from "@/components/fabric/FabricTextbox.vue";
import FabricImage from "@/components/fabric/FabricImage.vue";
import TextboxesList from "@/components/wafer/TextboxesList.vue";
import ImageSelector from "@/components/wafer/ImageSelector.vue";
import CropImageSelector from "@/components/wafer/CropImageSelector.vue";
import TypeSelector from "@/components/wafer/TypeSelector.vue";
import InputBase from "@/components/forms/InputBase.vue";
import Filters from "./Filters.vue";

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

export default defineComponent({
  components: {
    FabricCanvas,
    FabricTextbox,
    FabricImage,
    TextboxesList,
    ImageSelector,
    CropImageSelector,
    TypeSelector,
    InputBase,
    Filters,
  },
  setup() {
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
            renderer.addMinatures(image.value as HTMLImageElement);
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

    return {
      canvasOptions,
      textsOptions,
      imageOptions,
      image,
      onImageSelected,
      type,
      generatePdf,
      pending,
      canvasRef,
      renderOptions,
      WaferType,
      imageFilters,
    };
  },
});
</script>

<style lang="scss" scoped>
.wafer-canvas {
  border: 1px solid $primary;
}
</style>
