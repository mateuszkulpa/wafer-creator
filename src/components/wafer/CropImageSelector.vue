<template>
  <image-selector @selected="onImageSelected" label="Wybierz i przytnij" />
  <v-dialog fullscreen v-model="modalOpened">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="modalOpened = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="save">Zapisz</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div ref="croppieRef" class="croppie"></div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { nextTick, PropType, ref } from "vue";
import ImageSelector from "@/components/wafer/ImageSelector.vue";
import Croppie from "croppie";
import { WaferType } from "@/enums";
import { A4_SIZE_RATIO } from "@/constants";
const BASE_CROP_SIZE = 600;

const props = defineProps({
  waferType: {
    type: Number as PropType<WaferType>,
    required: true,
  },
});
const emit = defineEmits(["selected"]);

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
  if (croppieRef.value === null) return;

  croppie = new Croppie(croppieRef.value, {
    boundary: { width: 1000, height: 1000 },
    viewport: getViewportByWaferType(props.waferType),
  });
};

const onImageSelected = async (image: HTMLImageElement) => {
  modalOpened.value = true;
  await nextTick();
  intializeCroppie();
  if (croppie === null) return;
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
</script>

<style lang="scss" scoped>
@import "~croppie/croppie.css";
.croppie {
  margin-bottom: 2rem;
}
</style>
