<template>
  <v-radio-group v-model="innerValue">
    <v-radio
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    ></v-radio>
  </v-radio-group>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import { WaferType } from "@/enums";

const props = defineProps({
  modelValue: {
    type: Number as PropType<WaferType>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const innerValue = ref(props.modelValue);
watch(innerValue, () => emit("update:modelValue", innerValue.value));

const options = [
  {
    label: "Koło",
    value: WaferType.Circle,
  },
  {
    label: " Koło z miniaturkami",
    value: WaferType.CircleWithMiniatures,
  },
  {
    label: "A4 - poziomo",
    value: WaferType.RectangleLandsape,
  },
  {
    label: "A4 - pionowo",
    value: WaferType.RectanglePortrait,
  },
];
</script>
