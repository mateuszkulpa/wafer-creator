<template>
  <v-dialog fullscreen v-model="dialogOpened">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogOpened = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="pa-8">
        <div class="preview-projects">
          <v-card
            v-for="project in projects"
            :key="project.name"
            class="preview-projects__card elevation-2"
          >
            <v-img height="300" :src="project.previewImage"></v-img>

            <v-card-actions>
              <v-btn
                color="deep-purple-lighten-2"
                text
                @click="deleteProject(project)"
              >
                Usuń
              </v-btn>

              <v-btn
                color="deep-purple-lighten-2"
                text
                @click="restoreProject(project)"
              >
                Przywróć
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { FileSystemDirectoryHandle } from "@/fileAccess";
import Project from "@/types/project";

const emit = defineEmits(["restore"]);

const dialogOpened = ref(false);
const projects = ref<Project[]>([]);
const directoryAccess = shallowRef<FileSystemDirectoryHandle | null>(null);

const openDialog = async (dirAccess: FileSystemDirectoryHandle) => {
  directoryAccess.value = dirAccess;
  dialogOpened.value = true;

  const files = [];
  for await (const entry of directoryAccess.value.values()) {
    if (entry.kind !== "file" || !entry.name.includes(".json")) {
      continue;
    }
    const file = await entry.getFile();
    const content = JSON.parse(await file.text());
    content.name = entry.name;
    files.push(content);
  }
  files.sort((a, b) => b.name.localeCompare(a.name));
  projects.value = files;
};

const restoreProject = (project: Project) => {
  emit("restore", project);
  dialogOpened.value = false;
};

const deleteProject = async (project: Project) => {
  await directoryAccess.value.removeEntry(project.name);
  projects.value = projects.value.filter((f) => f.name !== project.name);
};

defineExpose({ openDialog });
</script>

<style lang="scss" scoped>
.preview-projects {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;

  &__card {
  }

  &__img {
    max-width: 100%;
  }
}
</style>
