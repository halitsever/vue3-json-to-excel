import component, { toRows } from "./vue3-json-to-excel.vue";

/** Lets `app.use()` register the component globally. */
component.install = (app) => {
  app.component("Vue3JsonToExcel", component);
};

export default component;
export { toRows };
