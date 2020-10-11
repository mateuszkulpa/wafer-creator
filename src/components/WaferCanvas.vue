<template>
<div>
  <canvas id="c" :width="CANVAS_SIZE" :height="CANVAS_SIZE" style="border: 1px solid black;"></canvas>
  <div>
      <input type="text" placeholder="text" v-model="textOptions.text"> <br />
      <input type="number"  v-model="textOptions.size"> <br />
      <input type="color"  v-model="textOptions.color"> <br />
      <select v-model.number="textOptions.fontWeight">
          <option :value="200">200</option>
          <option :value="300">300</option>
          <option :value="400">400</option>
          <option :value="500">500</option>
          <option :value="500">600</option>
          <option :value="700">700</option>
      </select>
      <select v-model="textOptions.fontFamily">
          <option v-for="font in FONTS" :key="font" :value="font">{{ font }}</option>
      </select>
    <button @click="renderCanvas">add text</button>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, watch, reactive } from "vue";
import fabricModule from "fabric";
import FontFaceObserver from "fontfaceobserver";
import _ from "lodash";
const fabric = fabricModule.fabric;

const CANVAS_SIZE = 500;
const FONTS = ["Pacifico", "VT323", "Quicksand", "Inconsolata"];

export default defineComponent({
  props: {
    image: {
      type: Object as PropType<HTMLImageElement | null>,
      required: false,
      default: null,
    },
  },
  setup(props, { emit }) {
    let canvas: fabric.Canvas | null = null;
    let textbox: fabric.Textbox | null;

    const initializeCanvas = () => {
      canvas = new fabric.Canvas("c");
      const emitChanges = _.debounce(() => {
        emit("change", canvas.toDataURL());
      }, 500);

      canvas.on("object:added", emitChanges);
      canvas.on("object:removed", emitChanges);
      canvas.on("object:modified", emitChanges);
    };

    onMounted(() => {
      initializeCanvas();
    });

    const textOptions = reactive({
      text: "Wszystkiego Najlepszego",
      size: 32,
      color: "#000",
      fontWeight: 300,
      fontFamily: FONTS[0],
    });

    const loadImage = (newImage: HTMLImageElement) => {
      canvas.clear();
      if (!props.image) return;
      var image = new fabric.Image(newImage, {
        scaleX: CANVAS_SIZE / newImage.width,
        scaleY: CANVAS_SIZE / newImage.height,
        selectable: false,
      });
      canvas.add(image);
    };

    const loadText = () => {
      const oldTop = textbox?.top || 0;
      const oldLeft = textbox?.left || 0;
      textbox = new fabric.Textbox(textOptions.text, {
        top: oldTop,
        left: oldLeft,
        dynamicMinWidth: 1,
        fontSize: textOptions.size,
        fill: textOptions.color,
        fontWeight: textOptions.fontWeight,
        fontFamily: textOptions.fontFamily,
      });

      canvas.add(textbox).setActiveObject(textbox);
    };

    watch(
      () => props.image,
      (newImage) => {
        loadImage(newImage);
        loadText();
      }
    );

    watch(textOptions, () => {
      loadImage(props.image);
      loadText();
    });

    watch(
      () => textOptions.fontFamily,
      (newFontFamily) => {
        loadFont(newFontFamily);
      }
    );

    const renderCanvas = () => {
      const result = canvas.toDataURL();
    };

    const loadFont = (font: string) => {
      var myfont = new FontFaceObserver(font);
      myfont
        .load()
        .then(function () {
          canvas.getActiveObject().set("fontFamily", font);
          canvas.requestRenderAll();
        })
        .catch(function (e) {
          alert("font loading failed " + font);
        });
    };

    return {
      renderCanvas,
      CANVAS_SIZE,
      FONTS,
      textOptions,
    };
  },
});
</script>