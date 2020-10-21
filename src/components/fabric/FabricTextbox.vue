<script lang="ts">
import { defineComponent, PropType, inject, Ref, ref, watch } from "vue";
import fabric from "@/fabric";
import { FABRIC_CANVAS_SYMBOL } from "@/constants";

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<fabric.ITextboxOptions>,
      required: false,
      default: () => ({})
    }
  },
  setup(props) {
    const canvas = inject<Ref<fabric.Canvas | null>>(
      FABRIC_CANVAS_SYMBOL,
      ref<fabric.Canvas | null>(null)
    );
    const textbox = ref<fabric.Textbox | null>(null);

    const initializeTextbox = () => {
      if (canvas.value === null || textbox.value !== null) return;

      textbox.value = new fabric.Textbox("", props.options);
      canvas.value.add(textbox.value);
    };

    const setOptions = () => {
      textbox.value?.set(props.options);
      canvas.value?.renderAll();
    };

    watch(canvas, () => {
      initializeTextbox();
    });

    watch(props.options, setOptions, { deep: true });

    return () => null;
  }
});
</script>
