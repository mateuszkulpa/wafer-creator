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
          variant="outlined"
        />
      </v-col>
      <v-col cols="6" class="mt-2">
        <v-text-field
          label="Wypełnienie"
          type="color"
          v-model="innerOptions[index].fill"
          variant="outlined"
        />
      </v-col>
      <v-col cols="6" class="mt-2">
        <v-text-field
          label="Kontur"
          type="color"
          v-model="innerOptions[index].stroke"
          variant="outlined"
        />
      </v-col>
      <v-col cols="4" class="mt-2">
        <v-text-field
          class="textboxes-list__input--small"
          density="comfortable"
          label="Rozmiar"
          type="number"
          v-model.number="innerOptions[index].fontSize"
          variant="outlined"
        />
      </v-col>
      <v-col cols="4" class="mt-2">
        <v-text-field
          density="comfortable"
          class="textboxes-list__input--small"
          label="Kontur"
          type="number"
          v-model.number="innerOptions[index].strokeWidth"
          variant="outlined"
        />
      </v-col>
      <v-col cols="4" class="mt-2">
        <v-text-field
          density="comfortable"
          class="textboxes-list__input--small"
          label="Wysokość"
          type="number"
          min="0.1"
          max="3"
          step="0.1"
          v-model.number="innerOptions[index].lineHeight"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" class="mt-2">
        <v-select
          dense
          label="Czcionka"
          v-model="innerOptions[index].fontFamily"
          :items="FONTS"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" class="mt-2">
        <div class="textboxes-list__buttons">
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
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-btn
      class="textboxes-list__add-button"
      variant="outlined"
      size="large"
      @click="onAddText"
    >
      <i class="fas fa-plus"></i>
    </v-btn>
  </v-container>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import fabric from "@/fabric";
import { FONTS, DEFAULT_TEXT_OPTIONS } from "@/constants";
import { cloneDeep } from "lodash";

const props = defineProps({
  modelValue: {
    type: Array as PropType<fabric.ITextboxOptions[]>,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);
const innerOptions = ref(cloneDeep(props.modelValue));

watch(
  () => props.modelValue,
  () => {
    innerOptions.value = cloneDeep(props.modelValue);
  }
);

watch(
  innerOptions,
  () => {
    emit("update:modelValue", innerOptions.value);
  },
  { deep: true }
);
const onAddText = () => {
  innerOptions.value.push({ ...DEFAULT_TEXT_OPTIONS });
};

const onRemoveText = (item: fabric.ITextboxOptions) => {
  innerOptions.value = innerOptions.value.filter((x) => x !== item);
};

const onDuplicateText = (item: fabric.ITextboxOptions) => {
  innerOptions.value.push({ ...item });
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
    grid-template-columns: repeat(4, 1fr);
  }

  &__add-button {
    width: 100%;
  }

  // BETA fix :(
  &__input--small {
    .v-field__input {
      max-width: 124px;
      input {
        max-width: 98px;
      }
    }
  }
}
</style>
