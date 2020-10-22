<template>
  <div class="file">
    <label class="file-label">
      <input class="file-input" type="file" v-bind="$attrs" />
      <span class="file-cta">
        <span class="file-icon">
          <i class="fas fa-upload"></i>
        </span>
        <span class="file-label">
          {{ label }}
        </span>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    label: {
      type: String,
      required: false,
      default: "Choose a file…"
    }
  }
});
</script>
