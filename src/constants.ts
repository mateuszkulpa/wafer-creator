import fabric from "@/fabric";

const FABRIC_CANVAS_SYMBOL = Symbol("fabric-canvas-symbol");
const DEFAULT_CANVAS_SIZE = 700;
const A4_SIZE_RATIO = 297 / 210;
const DEFAULT_FONT = "Luckiest Guy";

const FONTS = [
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
  "Kaushan Script"
];

const DEFAULT_TEXT_OPTIONS: fabric.ITextboxOptions = {
  text: "100 Lat",
  fontSize: 80,
  fontWeight: 300,
  fontFamily: DEFAULT_FONT,
  strokeWidth: 4,
  lineHeight: 1,
  fill: "#FFFFFF",
  stroke: "#000000",
  textAlign: "center",
  width: DEFAULT_CANVAS_SIZE * 0.5,
  top: DEFAULT_CANVAS_SIZE * 0.75,
  left: DEFAULT_CANVAS_SIZE * 0.25
};

export {
  FABRIC_CANVAS_SYMBOL,
  DEFAULT_CANVAS_SIZE,
  DEFAULT_TEXT_OPTIONS,
  DEFAULT_FONT,
  A4_SIZE_RATIO,
  FONTS
};
