<template>
  <teleport to="body">
    <div :class="['modal', { 'is-active': modelValue }]">
      <div
        class="modal-background"
        @click="() => $emit('update:modelValue', false)"
      ></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button
            class="delete"
            aria-label="close"
            @click="() => $emit('update:modelValue', false)"
          ></button>
        </header>
        <section class="modal-card-body">
          <slot />
        </section>
        <footer class="modal-card-foot">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
});
</script>
