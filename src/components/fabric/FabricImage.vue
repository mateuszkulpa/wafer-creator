<script lang="ts">
import {
  defineComponent,
  PropType,
  inject,
  Ref,
  ref,
  watch,
  onMounted,
} from "vue";
import fabric from "@/fabric";
import { FABRIC_CANVAS_SYMBOL } from "@/constants";

export default defineComponent({
  props: {
    image: {
      type: Object as PropType<
        string | HTMLImageElement | HTMLVideoElement | undefined
      >,
      required: false,
      default: undefined,
    },
    options: {
      type: Object as PropType<fabric.IImageOptions>,
      required: false,
      default: () => ({}),
    },
    filters: {
      type: Array as PropType<fabric.IBaseFilter[]>,
      required: true,
    },
  },
  emits: ["update:options"],
  setup(props, { emit }) {
    const canvas = inject<Ref<fabric.Canvas | null>>(
      FABRIC_CANVAS_SYMBOL,
      ref<fabric.Canvas | null>(null)
    );

    const image = ref<fabric.Image | null>(null);

    const onImageChanged = () => {
      emit("update:options", {
        ...props.options,
        scaleX: image.value?.scaleX,
        scaleY: image.value?.scaleY,
        width: image.value?.width,
        height: image.value?.height,
        top: image.value?.top,
        left: image.value?.left,
      });
    };

    const initializeImage = () => {
      if (canvas.value === null) {
        console.error(
          "FarbicTextbox cannot be rendered. It's should be child of FabricImage"
        );
        return;
      }
      if (props.image) {
        image.value = new fabric.Image(props.image, props.options);
        canvas.value?.add(image.value);
        canvas.value?.sendToBack(image.value);

        image.value?.on("modified", onImageChanged);
        image.value?.on("changed", onImageChanged);
      }
    };

    watch(
      () => props.image,
      () => {
        if (!image.value) initializeImage();
        else if (
          props.image instanceof HTMLImageElement ||
          props.image instanceof HTMLVideoElement
        ) {
          image.value?.setElement(props.image, props.options);
        } else if (typeof props.image === "string") {
          image.value?.setSrc(props.image);
        }
        canvas.value?.renderAll();
        applyFilters();
      }
    );

    const applyFilters = () => {
      if (!image.value) return;

      image.value.filters = props.filters;
      image.value.applyFilters();
      canvas.value?.renderAll();
    };

    const setOptions = () => {
      image.value?.set(props.options);
      canvas.value?.renderAll();
    };

    onMounted(() => initializeImage());
    watch(() => props.options, setOptions, { deep: true });
    watch(() => props.filters, applyFilters);

    return () => null;
  },
});
</script>
