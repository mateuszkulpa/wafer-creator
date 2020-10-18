<template>
<div style="display: flex; ">
  <canvas id="c" style="border: 1px solid black;"></canvas>
  <div style="padding: 0 2rem;">
      tekst <input type="text" placeholder="text" v-model="textOptions.text"> 
      rozmiar <input type="number"  v-model="textOptions.size"> 
      kolor <input type="color"  v-model="textOptions.color"> 
      kontur - rozmiar <input type="number" v-model.number="textOptions.strokeWidth"/>
      kontur - kolor <input type="color" v-model="textOptions.strokeColor"/>
      wysokość linni <input type="number" step="0.1" v-model.number="textOptions.lineHeight" />
      grubość <select v-model.number="textOptions.fontWeight">
          <option :value="200">200</option>
          <option :value="300">300</option>
          <option :value="400">400</option>
          <option :value="500">500</option>
          <option :value="500">600</option>
          <option :value="700">700</option>
      </select>
      czcionka <select v-model="textOptions.fontFamily">
          <option v-for="font in FONTS" :key="font" :value="font" :style="{'font-family': font}">{{ font }}</option>
      </select>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  watch,
  reactive,
  computed,
} from "vue";
import fabricModule from "fabric";
import _ from "lodash";
const fabric = fabricModule.fabric;
import { FONTS, DEFAULT_FONT } from "../fonts";
import { WaferType } from "../enums";
const CANVAS_SIZE = 800;

export default defineComponent({
  props: {
    image: {
      type: Object as PropType<HTMLImageElement | null>,
      required: false,
      default: null,
    },
    waferType: {
      type: Number as PropType<WaferType>,
      required: true,
    },
  },
  setup(props, { emit }) {
    let canvas: fabric.Canvas | null = null;
    let image: farbic.Image | null;
    let textbox: fabric.Textbox | null;

    const canvasSize = computed(() => {
      return {
        height: CANVAS_SIZE,
        width:
          CANVAS_SIZE * (props.waferType === WaferType.Circle ? 1 : 297 / 210),
      };
    });

    watch(
      () => props.waferType,
      () => {
        canvas.setHeight(canvasSize.value.height);
        canvas.setWidth(canvasSize.value.width);
      }
    );

    const emitChanges = _.debounce(() => {
      emit("change", canvas.toDataURL({
        multiplier: 2
      }));
    }, 500);

    const initializeCanvas = () => {
      canvas = new fabric.Canvas("c");
      canvas.setHeight(canvasSize.value.height);
      canvas.setWidth(canvasSize.value.width);
      

      canvas.on("object:added", emitChanges);
      canvas.on("object:removed", emitChanges);
      canvas.on("object:modified", emitChanges);
    };

    onMounted(() => {
      initializeCanvas();
    });

    const textOptions = reactive({
      text: "100 Lat",
      size: 80,
      color: "#FFFFFF",
      fontWeight: 300,
      fontFamily: DEFAULT_FONT,
      strokeWidth: 4,
      strokeColor: "#000000",
      lineHeight: 1,
    });

    const loadImage = (newImage: HTMLImageElement) => {
      if (image) {
        canvas.remove(image);
      }

      image = new fabric.Image(newImage, {
        scaleX: canvasSize.value.width / newImage.width,
        scaleY: canvasSize.value.height / newImage.height,
        width: newImage.width,
        height: newImage.height,
        selectable: false,
      });
      canvas.add(image);
    };

    const loadText = () => {
      if (!textbox) {
        textbox = new fabric.Textbox(textOptions.text, {
          top: canvasSize.value.height - 200,
          left: canvasSize.value.width / 4,
          width: canvasSize.value.width / 2,
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
        stroke: textOptions.strokeColor,
        lineHeight: textOptions.lineHeight,
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
      FONTS,
      textOptions,
      canvasSize,
    };
  },
});
</script>