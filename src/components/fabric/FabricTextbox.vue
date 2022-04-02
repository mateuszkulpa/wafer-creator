<script lang="ts">
import {
  defineComponent,
  PropType,
  inject,
  Ref,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import fabric from "@/fabric";
import { FABRIC_CANVAS_SYMBOL } from "@/constants";

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<fabric.ITextboxOptions>,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const canvas = inject<Ref<fabric.Canvas | null>>(
      FABRIC_CANVAS_SYMBOL,
      ref<fabric.Canvas | null>(null)
    );
    const textbox = ref<fabric.Textbox | null>(null);

    const onTextboxChanged = () => {
      emit("update:options", {
        ...props.options,
        top: textbox.value?.top,
        left: textbox.value?.left,
        text: textbox.value?.text,
        width: textbox.value?.width,
        height: textbox.value?.height,
        fontSize: textbox.value?.fontSize,
        scaleX: textbox.value?.scaleX,
        scaleY: textbox.value?.scaleY,
        angle: textbox.value?.angle,
      });
    };
    const initializeTextbox = () => {
      if (canvas.value === null) {
        console.error(
          "FarbicTextbox cannot be rendered. It's should be child of FabricCanvas"
        );
        return;
      }
      textbox.value = new fabric.Textbox("", props.options);
      textbox.value.on("modified", onTextboxChanged);
      textbox.value.on("changed", onTextboxChanged);

      canvas.value.add(textbox.value);
      canvas.value.bringToFront(textbox.value);
    };

    const setOptions = () => {
      textbox.value?.set(props.options);
      canvas.value?.renderAll();
    };

    const removeTextbox = () => {
      if (textbox.value) canvas.value?.remove(textbox.value);
    };
    onUnmounted(removeTextbox);
    onMounted(initializeTextbox);
    watch(() => props.options, setOptions, { deep: true });

    return () => null;
  },
});
</script>
