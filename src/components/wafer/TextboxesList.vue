<template>
  <div class="textboxes-list">
    <div v-for="(textOption, index) in innerOptions" :key="index" class="box">
      <div class="columns is-multiline is-variable is-4">
        <div class="column is-12">
          <input-base type="text" v-model="innerOptions[index].text" />
        </div>
        <div class="column is-4">
          <input-base type="color" v-model="innerOptions[index].fill" />
        </div>
        <div class="column is-4">
          <input-base type="color" v-model="innerOptions[index].stroke" />
        </div>
        <div class="column is-4">
          <input-base type="number" v-model="innerOptions[index].fontSize" />
        </div>
        <div class="column is-6">
          <div class="select">
            <select v-model="innerOptions[index].fontFamily">
              <option
                v-for="font in FONTS"
                :key="font"
                :value="font"
                :style="{ 'font-family': font }"
                >{{ font }}</option
              >
            </select>
          </div>
        </div>
        <div class="column is-6 is-flex is-justify-content-end">
          <button
            class="button is-danger is-outlined"
            @click="() => onRemoveText(innerOptions[index])"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <button class="button is-primary is-fullwidth" @click="onAddText">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import InputBase from "@/components/forms/InputBase.vue";
import fabric from "@/fabric";
import { FONTS, DEFAULT_TEXT_OPTIONS } from "@/constants";

export default defineComponent({
  components: { InputBase },
  props: {
    options: {
      type: Array as PropType<fabric.ITextboxOptions[]>,
      required: true
    }
  },
  setup(props, { emit }) {
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
      innerOptions.value = innerOptions.value.filter(x => x !== item);
      emit("update:options", innerOptions);
    };
    return { innerOptions, onAddText, onRemoveText, FONTS };
  }
});
</script>

<style lang="scss" scoped>
.textboxes-list {
  padding: 0 1rem;
  width: 500px;
  overflow: auto;
}
</style>
