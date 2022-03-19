ren
<template>
  <canvas ref="canvasRef">
    <slot v-if="canvas" />
  </canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch, provide } from "vue";
import fabric from "@/fabric";
import { FABRIC_CANVAS_SYMBOL } from "@/constants";

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<fabric.ICanvasOptions>,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const canvas = ref<fabric.Canvas | null>(null);
    provide(FABRIC_CANVAS_SYMBOL, canvas);

    onMounted(() => {
      canvas.value = new fabric.Canvas(canvasRef.value, props.options);
    });

    watch(props.options, (newOptions) => {
      if (canvas.value === null) return;

      if (newOptions.width !== undefined)
        canvas.value.setWidth(newOptions.width);
      if (newOptions.height !== undefined)
        canvas.value.setHeight(newOptions.height);
    });

    const toDataImage = () => {
      return new Promise<HTMLImageElement>((resolve) => {
        if (!canvas.value)
          throw Error(
            "Cannot generate image result, canvas is not initialized"
          );
        const dataURL = canvas.value.toDataURL({ multiplier: 2 });
        const image = new Image();
        image.src = dataURL;
        image.onload = () => resolve(image);
      });
    };

    return {
      canvasRef,
      canvas,
      toDataImage,
    };
  },
});
</script>
