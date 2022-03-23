import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import "@/styles/main.scss";

import { createApp } from "vue";
import App from "./App.vue";
import { loadAllFonts } from "./utils/fonts";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

loadAllFonts().then(() => {
  const app = createApp(App);
  const vuetify = createVuetify({
    components,
    directives,
  });
  app.use(vuetify);
  app.mount("#app");
});
