<template>
  <div>
    <input-base type="number" />
    <input-base type="number" />
    <input-base type="number" />
    <button class="button is-primary is-fullwidth">
      <i class="fas fa-file-pdf mr-2"></i>
      Generuj PDF
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import InputBase from "@/components/forms/InputBase.vue";
export default defineComponent({
  components: { InputBase }
});
</script>
