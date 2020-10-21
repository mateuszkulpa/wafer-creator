<template>
  <div style="display: flex; align-items: center;">
    <input type="file" @change="onUpload" accept="image/*">
    <div>
        <label for="wafer-type-circle" style="display: block;">
          <input v-model="waferType" type="radio" :value="WaferType.Circle" name="wafer-type" id="wafer-type-circle"/> Koło 
        </label>
        <label for="wafer-type-rectangle" style="display: block;">
          <input v-model="waferType" type="radio" :value="WaferType.Rectangle" name="wafer-type" id="wafer-type-rectangle"> Prostokąt
        </label>
    </div>
  </div>
  <div style="display: flex;">
    <wafer-canvas :image="image" @change="onCanvasChanged" :waferType="waferType" />
    <div>
        rozmiar 
        <input type="number" v-model.number="size">
        margines góra
        <input type="number" v-model.number="marginTop"> 
        <button @click="generatePdf" :disabled="finalImageBase64 === null">
          Generuj pdf
        </button>
        <button @click="generatePdfWithMinatures" :disabled="finalImageBase64 === null">
          Generuj pdf z miniaturkami
        </button>
    </div>
  </div>
</template>

<script lang="ts">
import { jsPDF } from "jspdf";
import { defineComponent, ref, computed } from "vue";
import WaferCanvas from "./components/WaferCanvas.vue";
import { WaferType } from "./enums";

const getImageByFile = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      var imgObj = new Image();
      imgObj.src = event.target!.result! as string;
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
  ctx?.drawImage(img, 0, 0);
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
    const waferType = ref<WaferType>(WaferType.Circle);

    const onUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files === null || !target.files.length) return null;
      const file = target.files[0];

      image.value = await getImageByFile(file);
    };

    const baseImage = computed(() => {
      return getBase64ByImage(image.value!);
    });

    const addCircleImageToPdf = (doc: jsPDF) => {
      doc.addImage(
        finalImageBase64.value!,
        "JPG",
        5,
        marginTop.value,
        size.value,
        size.value
      );
    };

    const addRectangleImageToPdf = (doc: jsPDF) => {
      doc.addImage(finalImageBase64.value!, "JPG", 5, 5, 297 - 10, 210 - 10);
    };

    const generatePdf = async () => {
      const doc = new jsPDF({
        orientation:
          waferType.value === WaferType.Circle ? "portrait" : "landscape",
      });
      if (waferType.value === WaferType.Circle) addCircleImageToPdf(doc);
      else if (waferType.value === WaferType.Rectangle)
        addRectangleImageToPdf(doc);
      doc.save(new Date().getTime() + ".pdf");
    };

    const generatePdfWithMinatures = () => {
      const doc = new jsPDF();
      addCircleImageToPdf(doc);

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
      WaferType,
      waferType,
    };
  },
});
</script>
