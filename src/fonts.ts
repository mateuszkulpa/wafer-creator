/* @ts-ignore  */
import FontFaceObserver from "fontfaceobserver";

export const fonts = [
  "Courgette",
  "Berkshire Swash",
  "Aladin",
  "Sedgwick Ave Display",
  "Amatic SC",
  "Anton",
  "Lobster",
  "Pacifico",
  "Bungee",
  "Bangers",
  "Audiowide",
  "Rubik Mono One",
  "Spectral SC",
  "Bungee Shade",
  "Ranchers",
  "Nosifer",
  "Staatliches",
  "Balsamiq Sans",
  "Luckiest Guy",
  "Press Start 2P",
  "Black Ops One",
  "Titan One",
  "Shojumaru",
  "Spicy Rice",
  "Arbutus",
  "Joti One",
  "Kaushan Script",
];

const loadFont = (font: string) => {
  var myfont = new FontFaceObserver(font);
  myfont.load().then(function () {});
};

export function loadFonts() {
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?${fonts
    .map((f) => `family=${f.replace(" ", "+")}`)
    .join("&")}&display=swap`;

  link.rel = "stylesheet";
  document.head.appendChild(link);

  for (const family of fonts) loadFont(family);
}
