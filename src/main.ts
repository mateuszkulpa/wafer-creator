import { createApp } from "vue";
import App from "./App.vue";
import "./index.scss";
import { loadFonts } from "./fonts";

loadFonts();
createApp(App).mount("#app");
