import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

/** Ships the repo's llms.txt with the site so there is one copy to keep current. */
const llmsTxt = {
  name: "llms-txt",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "llms.txt",
      source: fs.readFileSync(path.resolve(import.meta.dirname, "llms.txt"), "utf8"),
    });
  },
};

/** Every index.html under site/ is a page, so a new page only needs its folder. */
function pages(dir, out = {}) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'public') pages(full, out);
    else if (entry.name === 'index.html') out[path.relative(siteRoot, dir) || 'main'] = full;
  });
  return out;
}

const siteRoot = path.resolve(import.meta.dirname, 'site');

export default defineConfig({
  root: "site",
  base: "/vue3-json-to-excel/",
  plugins: [vue(), llmsTxt],
  resolve: {
    /** The site runs on the built bundle that ships to npm, so build the package first. */
    alias: [{ find: /^vue3-json-to-excel$/, replacement: path.resolve(import.meta.dirname, "dist/vue3-json-to-excel.mjs") }],
  },
  build: {
    outDir: "../site-dist",
    emptyOutDir: true,
    rolldownOptions: { input: pages(siteRoot) },
  },
});
