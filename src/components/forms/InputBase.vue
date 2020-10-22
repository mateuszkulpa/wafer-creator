<template>
  <div class="field">
    <div class="control">
      <input class="input" v-bind="$attrs" v-model="innerValue" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, PropType } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
      required: false,
      default: null
    }
  },
  setup(props, { emit }) {
    const innerValue = ref<string | number | null>(props.modelValue);
    watch(
      () => props.modelValue,
      () => (innerValue.value = props.modelValue)
    );
    watch(innerValue, () => emit("update:modelValue", innerValue.value));
    return { innerValue };
  }
});
</script>
