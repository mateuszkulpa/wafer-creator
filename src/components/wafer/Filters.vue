<template>
  <div class="filters">
    <label for="brightness">
      brightness {{ brightness.toFixed(2) }} <br />
      <input
        type="range"
        id="brightness"
        class="filters__input"
        v-model.number="brightness"
        min="-1"
        max="1"
        step="0.01"
      />
    </label>

    <label for="saturation">
      saturation {{ saturation.toFixed(2) }} <br />
      <input
        type="range"
        id="saturation"
        class="filters__input"
        v-model.number="saturation"
        min="-1"
        max="1"
        step="0.01"
      />
    </label>

    <label for="contrast">
      contrast {{ contrast.toFixed(2) }} <br />
      <input
        type="range"
        id="contrast"
        class="filters__input"
        v-model.number="contrast"
        min="-1"
        max="1"
        step="0.01"
      />
    </label>

    <button class="button is-fullwidth mt-4" @click="resetFilters">
      Reset
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "@vue/runtime-core";
import fabric from "@/fabric";

export default defineComponent({
  setup(_, { emit }) {
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
        new fabric.Image.filters.Contrast({ contrast: contrast.value })
      ]);
    });

    return {
      brightness,
      saturation,
      contrast,
      resetFilters
    };
  }
});
</script>

<style lang="scss" scoped>
.filters {
  &__input {
    width: 100%;
  }
}
</style>
