<template>
  <div>
    <input-file @input="onUpload" accept="image/*" label="Wybierz zdjęcie" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getImageByFile } from "@/utils/image";
import InputFile from "@/components/forms/InputFile.vue";
export default defineComponent({
  components: {
    InputFile
  },
  setup(props, { emit }) {
    const onUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files === null || target.files.length === 0) return;
      const file = target.files[0];
      const imageElement = await getImageByFile(file);
      emit("selected", imageElement);
    };
    return {
      onUpload
    };
  }
});
</script>
