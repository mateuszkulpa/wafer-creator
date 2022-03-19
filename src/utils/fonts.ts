import FontFaceObserver from "fontfaceobserver";
import { FONTS } from "@/constants";

const loadFont = (font: string) => {
  return new FontFaceObserver(font).load();
};
const googleFontsHref = () =>
  `https://fonts.googleapis.com/css2?${FONTS.map(
    (f) => `family=${f.replace(" ", "+")}`
  ).join("&")}&display=swap`;

export function loadAllFonts() {
  const link = document.createElement("link");
  link.href = googleFontsHref();

  link.rel = "stylesheet";
  document.head.appendChild(link);
  return Promise.all(FONTS.map((x) => loadFont(x)));
}
