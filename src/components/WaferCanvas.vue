<template>
<div style="display: flex; ">
  <canvas id="c" :width="CANVAS_SIZE" :height="CANVAS_SIZE" style="border: 1px solid black;"></canvas>
  <div style="padding: 0 2rem;">
      tekst <input type="text" placeholder="text" v-model="textOptions.text"> 
      rozmiar <input type="number"  v-model="textOptions.size"> 
      kolor <input type="color"  v-model="textOptions.color"> 
      kontur - rozmiar <input type="number" v-model.number="textOptions.strokeWidth"/>
      kontur - kolor <input type="color" v-model="textOptions.strokeColor"/>
      grubość <select v-model.number="textOptions.fontWeight">
          <option :value="200">200</option>
          <option :value="300">300</option>
          <option :value="400">400</option>
          <option :value="500">500</option>
          <option :value="500">600</option>
          <option :value="700">700</option>
      </select>
      czcionka <select v-model="textOptions.fontFamily">
          <option v-for="font in fonts" :key="font" :value="font" :style="{'font-family': font}">{{ font }}</option>
      </select>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, watch, reactive } from "vue";
import fabricModule from "fabric";
import _ from "lodash";
const fabric = fabricModule.fabric;
import { fonts } from "../fonts";
const CANVAS_SIZE = 800;

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
    let image: farbic.Image | null;
    let textbox: fabric.Textbox | null;

    const emitChanges = _.debounce(() => {
      emit("change", canvas.toDataURL());
    }, 500);

    const initializeCanvas = () => {
      canvas = new fabric.Canvas("c");

      canvas.on("object:added", emitChanges);
      canvas.on("object:removed", emitChanges);
      canvas.on("object:modified", emitChanges);
    };

    onMounted(() => {
      initializeCanvas();
    });

    const textOptions = reactive({
      text: "100 Lat",
      size: 64,
      color: "#FFFFFF",
      fontWeight: 300,
      fontFamily: fonts[0],
      strokeWidth: 2,
      strokeColor: "#000000"
    });

    const loadImage = (newImage: HTMLImageElement) => {
      if (image) {
        canvas.remove(image);
      }

      image = new fabric.Image(newImage, {
        scaleX: CANVAS_SIZE / newImage.width,
        scaleY: CANVAS_SIZE / newImage.height,
        selectable: false
      });
      canvas.add(image);
    };

    const loadText = () => {
      if (!textbox) {
        textbox = new fabric.Textbox(textOptions.text, {
          top: CANVAS_SIZE - 200,
          left: CANVAS_SIZE / 4,
          width: CANVAS_SIZE / 2,
          textAlign: "center",
        });
        canvas.add(textbox).setActiveObject(textbox);

        textbox.on("changed", () => {
          textOptions.text = textbox.text;
        });
      }

      textbox.set({
        text: textOptions.text,
        fontSize: textOptions.size,
        fill: textOptions.color,
        fontWeight: textOptions.fontWeight,
        fontFamily: textOptions.fontFamily,
        strokeWidth: textOptions.strokeWidth,
        stroke: textOptions.strokeColor
      });

      canvas.bringToFront(textbox);

      canvas.renderAll();
      emitChanges();
    };

    watch(
      () => props.image,
      (newImage) => {
        loadImage(newImage);
        loadText();
      }
    );

    watch(textOptions, () => {
      loadText();
    });
    

    return {
      CANVAS_SIZE,
      fonts,
      textOptions,
    };
  },
});
</script>