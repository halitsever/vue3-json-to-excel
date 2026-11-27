import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const root = path.resolve(import.meta.dirname, "..");
const name = "vue3-json-to-excel";
const files = { es: `${name}.mjs`, cjs: `${name}.cjs`, iife: `${name}.min.js` };

/** CJS and IIFE expose a single value, so `--mode single` builds them from the entry that hangs named exports on the component. */
export default defineConfig(({ mode }) => {
  const single = mode === "single";
  return {
    root,
    publicDir: false,
    plugins: [vue()],
    build: {
      emptyOutDir: !single,
      lib: {
        entry: path.resolve(root, single ? "src/entry.js" : "src/entry.esm.js"),
        name: "Vue3JsonToExcel",
        formats: single ? ["cjs", "iife"] : ["es"],
        fileName: (format) => files[format],
      },
      rolldownOptions: {
        external: ["vue"],
        output: { globals: { vue: "Vue" }, exports: single ? "default" : "named" },
      },
    },
  };
});
