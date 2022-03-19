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
  setup(props) {
    const canvas = inject<Ref<fabric.Canvas | null>>(
      FABRIC_CANVAS_SYMBOL,
      ref<fabric.Canvas | null>(null)
    );

    const image = ref<fabric.Image | null>(null);

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
      }
    );

    const applyFilters = () => {
      if (!image.value) return;

      console.log("apply", props.filters);
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
    watch(() => props.filters, applyFilters, { deep: true });

    return () => null;
  },
});
</script>
