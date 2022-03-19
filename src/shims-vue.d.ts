/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
