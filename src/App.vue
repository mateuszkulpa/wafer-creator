<template>
  <pre>{{ textOptions }}</pre>
  <div class="box">
    <fabric-canvas :options="canvasOptions">
      <fabric-textbox :options="textOptions" />
    </fabric-canvas>
  </div>
  <input type="text" v-model="textOptions.text" />
  <input type="color" v-model="textOptions.fill" />
  <input type="number" v-model="textOptions.fontSize" />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import FabricCanvas from "@/components/fabric/FabricCanvas.vue";
import FabricTextbox from "@/components/fabric/FabricTextbox.vue";
import fabric from "@/fabric";

export default defineComponent({
  components: { FabricCanvas, FabricTextbox },
  setup() {
    const canvasOptions = reactive<fabric.ICanvasOptions>({
      width: 500,
      height: 500,
      backgroundColor: "#CCC"
    });

    const textOptions = reactive<fabric.ITextboxOptions>({
      text: "This is a sample text",
      width: 500,
      fontSize: 32,
      textAlign: "center"
    });

    return { canvasOptions, textOptions };
  }
});
</script>
