<template>
  <div>
    <image-selector @selected="onImageSelected" label="Wybierz i przytnij" />

    <base-modal v-model="modalOpened" title="Przytnij zdjęcie">
      <div ref="croppieRef" class="croppie"></div>
      <template #footer>
        <button class="button is-primary" @click="save">Zapisz</button>
      </template>
    </base-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import ImageSelector from "@/components/wafer/ImageSelector.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import Croppie from "croppie";
import { WaferType } from "@/enums";
import { A4_SIZE_RATIO } from "@/constants";
const BASE_CROP_SIZE = 600;

export default defineComponent({
  components: { ImageSelector, BaseModal },
  props: {
    waferType: {
      type: Number as PropType<WaferType>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const modalOpened = ref(false);
    const croppieRef = ref<HTMLElement | null>(null);
    let croppie: Croppie | null = null;

    const getViewportByWaferType = (type: WaferType) => {
      const all: Record<
        WaferType,
        { width: number; height: number; type: "circle" | "square" | undefined }
      > = {
        [WaferType.Circle]: {
          width: BASE_CROP_SIZE,
          height: BASE_CROP_SIZE,
          type: "circle",
        },
        [WaferType.CircleWithMiniatures]: {
          width: BASE_CROP_SIZE,
          height: BASE_CROP_SIZE,
          type: "circle",
        },
        [WaferType.RectanglePortrait]: {
          width: BASE_CROP_SIZE,
          height: BASE_CROP_SIZE * A4_SIZE_RATIO,
          type: undefined,
        },
        [WaferType.RectangleLandsape]: {
          width: BASE_CROP_SIZE * A4_SIZE_RATIO,
          height: BASE_CROP_SIZE,
          type: undefined,
        },
      };
      return all[type];
    };

    const intializeCroppie = () => {
      if (croppie !== null) croppie.destroy();
      if (!croppieRef.value) return;
      croppie = new Croppie(croppieRef.value, {
        boundary: { width: 1000, height: 1000 },
        viewport: getViewportByWaferType(props.waferType),
      });
    };
    onMounted(() => {
      intializeCroppie();
    });

    watch(() => props.waferType, intializeCroppie);

    const onImageSelected = (image: HTMLImageElement) => {
      if (!croppie) return;
      modalOpened.value = true;
      croppie.bind({
        url: image.src,
        zoom: 0,
      });
    };

    const save = async () => {
      if (!croppie) return;
      const result = await croppie.result({
        type: "base64",
      });
      const image = new Image();
      image.src = result;
      image.onload = function () {
        emit("selected", image);
        modalOpened.value = false;
      };
    };

    return {
      modalOpened,
      croppieRef,
      onImageSelected,
      save,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "~croppie/croppie.css";
.croppie {
  margin-bottom: 2rem;
}
</style>
