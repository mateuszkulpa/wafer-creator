<template>
  <div class="control">
    <label class="is-block">
      <input
        v-model="innerValue"
        type="radio"
        name="wafer-type"
        :value="WaferType.Circle"
      />
      Koło
    </label>
    <label class="is-block">
      <input
        v-model="innerValue"
        type="radio"
        name="wafer-type"
        :value="WaferType.CircleWithMiniatures"
      />
      Koło z miniaturkami
    </label>
    <label class="is-block">
      <input
        v-model="innerValue"
        type="radio"
        name="wafer-type"
        :value="WaferType.RectangleLandsape"
      />
      A4 - poziomo
    </label>
    <label class="is-block">
      <input
        v-model="innerValue"
        type="radio"
        name="wafer-type"
        :value="WaferType.RectanglePortrait"
      />
      A4 - pionowo
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { WaferType } from "@/enums";
export default defineComponent({
  props: {
    modelValue: {
      type: Number as PropType<WaferType>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const innerValue = ref(props.modelValue);
    watch(innerValue, () => emit("update:modelValue", innerValue.value));
    return {
      innerValue,
      WaferType,
    };
  },
});
</script>
