<template>
  <div class="field">
    <div class="control">
      <input
        class="input"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <label class="label">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String as PropType<string>,
      required: false,
      default: ""
    },
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
      required: false,
      default: null
    }
  }
});
</script>

<style lang="scss" scoped>
.field {
  position: relative;
  label {
    position: absolute;
    top: -10px;
    left: 8px;
    padding: 0 3px;
    background: $white;
    font-size: $size-7;
  }
}
</style>
