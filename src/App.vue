<template>
  <input type="file" @change="onUpload" accept="image/*">
  <hr>
  <wafer-canvas :image="image" @change="onCanvasChanged" />
  <hr>
  rozmiar 
  <input type="number" v-model.number="size">
  <br/>
  margines góra
  <input type="number" v-model.number="marginTop"> <br>

  <button @click="generatePdf" :disabled="finalImageBase64 === null">
    Generuj pdf
  </button>
   <button @click="generatePdfWithMinatures" :disabled="finalImageBase64 === null">
    Generuj pdf z miniaturkami
  </button>
</template>

<script lang="ts">
import { jsPDF } from "jspdf";
import { defineComponent, ref, computed } from "vue";
import WaferCanvas from "./components/WaferCanvas.vue";

const getImageByFile = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      var imgObj = new Image();
      imgObj.src = event.target.result;
      imgObj.onload = () => {
        resolve(imgObj);
      };
    };
    reader.onerror = (error) => reject(error);
  });

const getBase64ByImage = (img: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;

  // I think this won't work inside the function from the console
  img.crossOrigin = "anonymous";
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL();
};

export default defineComponent({
  name: "App",
  components: { WaferCanvas },
  setup() {
    const size = ref(200);
    const marginTop = ref(15);
    const image = ref<HTMLImageElement | null>(null);
    const finalImageBase64 = ref<string | null>(null);

    const onUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files === null || !target.files.length) return null;
      const file = target.files[0];

      image.value = await getImageByFile(file);
    };

    const baseImage = computed(() => {
      return getBase64ByImage(image.value);
    });

    const baseImageFormat = computed(() => {
      return;
    });

    const generatePdf = async () => {
      const doc = new jsPDF();
      doc.addImage(
        finalImageBase64.value,
        "JPG",
        5,
        marginTop.value,
        size.value,
        size.value
      );
      doc.save(new Date().getTime() + ".pdf");
    };

    const generatePdfWithMinatures = () => {
      const doc = new jsPDF();
      doc.addImage(
        finalImageBase64.value,
        "JPG",
        5,
        marginTop.value,
        size.value,
        size.value
      );
      
      const top = size.value + marginTop.value + 10;
      const minatureSize = 45;

      for (let i = 0; i < 4; i++) {
        doc.addImage(
          baseImage.value,
          "JPG",
          5 + minatureSize * i + (20 / 3) * i,
          top,
          minatureSize,
          minatureSize
        );
      }
      doc.save(new Date().getTime() + ".pdf");
    };

    const onCanvasChanged = (base64Image: string) => {
      finalImageBase64.value = base64Image;
    };

    return {
      generatePdfWithMinatures,
      finalImageBase64,
      onCanvasChanged,
      image,
      marginTop,
      size,
      onUpload,
      generatePdf,
    };
  },
});
</script>
