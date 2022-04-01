<template>
  <div class="filters">
    <div class="filters__caption text-caption">
      brightness
      <div class="filters__divider"></div>
      {{ brightness }}
    </div>
    <v-slider
      v-model="brightness"
      min="-1"
      max="1"
      step="0.01"
      class="filters__input"
    ></v-slider>

    <div class="filters__caption text-caption">
      saturation
      <div class="filters__divider"></div>
      {{ saturation }}
    </div>
    <v-slider
      v-model="saturation"
      min="-1"
      max="1"
      step="0.01"
      class="filters__input"
    ></v-slider>

    <div class="filters__caption text-caption">
      contrast
      <div class="filters__divider"></div>
      {{ contrast }}
    </div>
    <v-slider
      v-model="contrast"
      min="-1"
      max="1"
      step="0.01"
      class="filters__input"
    ></v-slider>

    <v-btn @click="resetFilters" variant="outlined" class="filters__reset"
      >Reset</v-btn
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, PropType, watch } from "vue";
import fabric from "@/fabric";

const emit = defineEmits(["update:filters"]);
const props = defineProps({
  filters: {
    type: Array as PropType<fabric.IBaseFilter[]>,
    required: true,
  },
});

const brightness = ref(0);
const saturation = ref(0);
const contrast = ref(0);

const resetFilters = () => {
  brightness.value = 0;
  saturation.value = 0;
  contrast.value = 0;
};

watchEffect(() => {
  emit("update:filters", [
    new fabric.Image.filters.Brightness({ brightness: brightness.value }),
    new fabric.Image.filters.Saturation({ saturation: saturation.value }),
    new fabric.Image.filters.Contrast({ contrast: contrast.value }),
  ]);
});

watch(
  () => props.filters,
  (newFilters) => {
    const filterObjects = newFilters.map((f) => f.toObject());
    console.log(filterObjects);
    brightness.value =
      filterObjects.find((f) => f.type === "Brightness")?.brightness ?? 0;
    saturation.value =
      filterObjects.find((f) => f.type === "Saturation")?.saturation ?? 0;
    contrast.value =
      filterObjects.find((f) => f.type === "Contrast")?.contrast ?? 0;
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;

  &__input {
    margin: 0 !important;
  }

  &__caption {
    display: flex;
  }

  &__divider {
    flex-grow: 1;
  }

  &__reset {
    margin-top: 1rem;
    width: 100%;
  }
}
</style>
