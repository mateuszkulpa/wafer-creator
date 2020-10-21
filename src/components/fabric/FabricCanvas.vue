<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref,
  watch,
  h,
  provide
} from "vue";
import fabric from "@/fabric";
import { FABRIC_CANVAS_SYMBOL } from "@/constants";

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<fabric.ICanvasOptions>,
      required: false,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const canvas = ref<fabric.Canvas | null>(null);
    provide(FABRIC_CANVAS_SYMBOL, canvas);

    onMounted(() => {
      canvas.value = new fabric.Canvas(canvasRef.value, props.options);
    });

    watch(props.options, newOptions => {
      if (canvas.value === null) return;

      if (newOptions.width !== undefined)
        canvas.value.setWidth(newOptions.width);
      if (newOptions.height !== undefined)
        canvas.value.setHeight(newOptions.height);
    });

    return () => h("canvas", { ref: canvasRef }, slots);
  }
});
</script>
