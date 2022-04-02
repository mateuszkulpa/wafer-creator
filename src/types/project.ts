import fabric from "@/fabric";
import { WaferType } from "@/enums";

export default interface Project {
  name: string;
  type: WaferType;
  textsOptions: fabric.ITextboxOptions[];
  imageOptions: fabric.IImageOptions;
  renderOptions: {
    radius: number;
    marginTop: number;
    margin: number;
  };
  canvasOptions: {
    width: number;
    height: number;
    preserveObjectStacking: boolean;
  };
  image: string;
  previewImage: string;
  filters: ({
    type: string;
  } & Record<string, number>)[];
}
