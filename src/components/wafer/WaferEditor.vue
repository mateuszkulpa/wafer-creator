<template>
  <section class="section is-small">
    <div
      class="is-flex is-justify-content-space-between is-align-content-start"
    >
      <div>
        <div class="box">
          <type-selector v-model="type" />
          <image-selector class="mt-4" @selected="onImageSelected" />
        </div>
        <div class="box">
          <render-options />
        </div>
      </div>

      <div>
        <div class="box">
          <fabric-canvas :options="canvasOptions" class="wafer-canvas">
            <fabric-image :image="image" v-model:options="imageOptions" />
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
import { defineComponent, ref, watch } from "vue";
import FabricCanvas from "@/components/fabric/FabricCanvas.vue";
import FabricTextbox from "@/components/fabric/FabricTextbox.vue";
import FabricImage from "@/components/fabric/FabricImage.vue";
import TextboxesList from "@/components/wafer/TextboxesList.vue";
import ImageSelector from "@/components/wafer/ImageSelector.vue";
import TypeSelector from "@/components/wafer/TypeSelector.vue";
import RenderOptions from "@/components/wafer/RenderOptions.vue";
import fabric from "@/fabric";
import {
  DEFAULT_TEXT_OPTIONS,
  DEFAULT_CANVAS_SIZE,
  A4_SIZE_RATIO
} from "@/constants";
import { WaferType } from "@/enums";

const getSizeByWaferType = (
  type: WaferType
): { width: number; height: number } => {
  const shortestSide = DEFAULT_CANVAS_SIZE;
  const longestSide = DEFAULT_CANVAS_SIZE * A4_SIZE_RATIO;
  return {
    [WaferType.Circle]: { width: shortestSide, height: shortestSide },
    [WaferType.CircleWithMiniatures]: {
      width: shortestSide,
      height: shortestSide
    },
    [WaferType.RectangleLandsape]: { width: longestSide, height: shortestSide },
    [WaferType.RectanglePortrait]: { width: shortestSide, height: longestSide }
  }[type];
};

export default defineComponent({
  components: {
    FabricCanvas,
    FabricTextbox,
    FabricImage,
    TextboxesList,
    ImageSelector,
    TypeSelector,
    RenderOptions
  },
  setup() {
    const canvasOptions = ref<fabric.ICanvasOptions>({
      width: DEFAULT_CANVAS_SIZE,
      height: DEFAULT_CANVAS_SIZE,
      preserveObjectStacking: true
    });

    const imageOptions = ref<fabric.IImageOptions>({
      width: DEFAULT_CANVAS_SIZE,
      height: DEFAULT_CANVAS_SIZE
    });

    const textsOptions = ref<fabric.ITextboxOptions[]>([
      { ...DEFAULT_TEXT_OPTIONS }
    ]);

    const image = ref<HTMLImageElement | null>(null);
    const type = ref<WaferType>(WaferType.Circle);
    watch(type, () => {
      const size = getSizeByWaferType(type.value);
      canvasOptions.value.width = size.width;
      canvasOptions.value.height = size.height;
    });

    const onImageSelected = (imageElement: HTMLImageElement) => {
      imageOptions.value = {
        scaleX: (canvasOptions.value.width || 0) / imageElement.width,
        scaleY: (canvasOptions.value.height || 0) / imageElement.height,
        width: imageElement.width,
        height: imageElement.height,
        selectable: true
      };
      image.value = imageElement;
    };

    return {
      canvasOptions,
      textsOptions,
      imageOptions,
      image,
      onImageSelected,
      type
    };
  }
});
</script>

<style lang="scss" scoped>
.wafer-canvas {
  border: 1px solid $primary;
}
</style>
