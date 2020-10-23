import { createApp } from "vue";
import App from "./App.vue";
import "@/styles/main.scss";
import { loadAllFonts } from "./utils/fonts";

loadAllFonts().then(() => {
  createApp(App).mount("#app");
});
