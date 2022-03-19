<template>
  <v-container
    v-for="(textOption, index) in innerOptions"
    :key="index"
    class="box"
  >
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          label="Tekst"
          type="text"
          v-model="innerOptions[index].text"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Wypełnienie"
          type="color"
          v-model="innerOptions[index].fill"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="Kontur"
          type="color"
          v-model="innerOptions[index].stroke"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          class="textboxes-list__input--small"
          density="comfortable"
          label="Rozmiar"
          type="number"
          v-model.number="innerOptions[index].fontSize"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          density="comfortable"
          class="textboxes-list__input--small"
          label="Kontur"
          type="number"
          v-model.number="innerOptions[index].strokeWidth"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          density="comfortable"
          class="textboxes-list__input--small"
          label="Wysokość"
          type="number"
          min="0.1"
          max="3"
          step="0.1"
          v-model.number="innerOptions[index].lineHeight"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          dense
          label="Czcionka"
          v-model="innerOptions[index].fontFamily"
          :items="FONTS"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <div class="textboxes-list__buttons mt-2">
          <v-btn
            variant="outlined"
            @click="() => onUppercaseText(innerOptions[index])"
          >
            A
          </v-btn>
          <v-btn
            variant="outlined"
            @click="() => onLowercaseText(innerOptions[index])"
          >
            a
          </v-btn>
          <v-btn
            variant="outlined"
            @click="() => onDuplicateText(innerOptions[index])"
          >
            <i class="fas fa-copy"></i>
          </v-btn>
          <v-btn
            variant="outlined"
            color="error"
            @click="() => onRemoveText(innerOptions[index])"
          >
            <i class="fas fa-trash"></i>
          </v-btn>
          <v-btn variant="outlined" color="primary" @click="onAddText">
            <i class="fas fa-plus"></i>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import fabric from "@/fabric";
import { FONTS, DEFAULT_TEXT_OPTIONS } from "@/constants";

const props = defineProps({
  options: {
    type: Array as PropType<fabric.ITextboxOptions[]>,
    required: true,
  },
});
const emit = defineEmits(["update:options"]);
const innerOptions = ref(props.options);

watch(
  innerOptions,
  () => {
    emit("update:options", innerOptions);
  },
  { deep: true }
);

const onAddText = () => {
  innerOptions.value.push({ ...DEFAULT_TEXT_OPTIONS });
};

const onRemoveText = (item: fabric.ITextboxOptions) => {
  innerOptions.value = innerOptions.value.filter((x) => x !== item);
  emit("update:options", innerOptions);
};

const onDuplicateText = (item: fabric.ITextboxOptions) => {
  innerOptions.value.push({ ...item });
  emit("update:options", innerOptions);
};

const onUppercaseText = (item: fabric.ITextboxOptions) => {
  item.text = item.text?.toUpperCase();
};

const onLowercaseText = (item: fabric.ITextboxOptions) => {
  item.text = item.text?.toLowerCase();
};
</script>

<style lang="scss">
.textboxes-list {
  &__buttons {
    display: grid;
    grid-column-gap: 0.5rem;
    grid-template-columns: repeat(5, 1fr);
  }

  &__input--small {
    .v-field__input {
      max-width: 124px;
    }
  }
}
</style>
