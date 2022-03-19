<template>
  <v-file-input
    accept="image/*"
    :label="label"
    @change.stop="onUpload"
  ></v-file-input>
</template>

<script lang="ts" setup>
import { getImageByFile } from "@/utils/image";

defineProps({
  label: {
    type: String,
    required: false,
    default: "Wybierz zdjęcie",
  },
});

const emit = defineEmits(["selected"]);

const onUpload = async (event: Event) => {
  console.log("change");
  const target = event.target as HTMLInputElement;
  if (target.files === null || target.files.length === 0) return;
  const file = target.files[0];
  const imageElement = await getImageByFile(file);
  emit("selected", imageElement);
};
</script>
