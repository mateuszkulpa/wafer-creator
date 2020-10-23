import jsPDF from "jspdf";

const PAGE_A4_LONGEST_SIDE = 297;
const PAGE_A4_SHORTEST_SIDE = 210;
type ImageInput = string | HTMLImageElement;

class PdfRenderer {
  private doc: jsPDF;

  constructor(orientation: "portrait" | "landscape") {
    this.doc = new jsPDF({ orientation: orientation });
  }

  addCircleImage(
    image: ImageInput,
    options: { radius: number; marginTop: number }
  ) {
    this.doc.addImage(
      image,
      "PNG",
      (PAGE_A4_SHORTEST_SIDE - options.radius) / 2,
      options.marginTop,
      options.radius,
      options.radius
    );

    return this;
  }

  addRectangleLandscapeImage(image: ImageInput, options: { margin: number }) {
    this.doc.addImage(
      image,
      "PNG",
      options.margin,
      options.margin,
      PAGE_A4_LONGEST_SIDE - options.margin * 2,
      PAGE_A4_SHORTEST_SIDE - options.margin * 2
    );

    return this;
  }

  addRectanglePortraitImage(image: ImageInput, options: { margin: number }) {
    this.doc.addImage(
      image,
      "PNG",
      options.margin,
      options.margin,
      PAGE_A4_SHORTEST_SIDE - options.margin * 2,
      PAGE_A4_LONGEST_SIDE - options.margin * 2
    );

    return this;
  }

  addMinatures(image: ImageInput) {
    const MINATURE_SIZE = 45;

    for (let i = 0; i < 4; i++) {
      this.doc.addImage(
        image,
        "PNG",
        5 + (MINATURE_SIZE + 20 / 3) * i,
        PAGE_A4_LONGEST_SIDE - MINATURE_SIZE - 10,
        MINATURE_SIZE,
        MINATURE_SIZE
      );
    }
    return this;
  }

  save() {
    this.doc.save(`${new Date().getTime()}.pdf`);
  }
}
export default PdfRenderer;
