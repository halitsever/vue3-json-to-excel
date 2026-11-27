import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import Vue3JsonToExcel, { toRows } from "vue3-json-to-excel";

const require = createRequire(import.meta.url);

test("ESM entry exports an installable component and toRows", () => {
  assert.equal(Vue3JsonToExcel.name, "Vue3JsonToExcel");
  assert.equal(typeof Vue3JsonToExcel.install, "function");
  assert.equal(typeof toRows, "function");
});

test("CJS entry returns the component itself", () => {
  const cjs = require("vue3-json-to-excel");
  assert.equal(cjs.name, "Vue3JsonToExcel");
  assert.equal(typeof cjs.install, "function");
  assert.equal(typeof cjs.toRows, "function");
});

test("toRows flattens nested objects and keeps arrays as JSON text", () => {
  assert.deepEqual(toRows({ a: 1, b: { c: 2 }, d: [1, 2] }), [{ a: 1, "b.c": 2, d: "[1,2]" }]);
  assert.deepEqual(toRows([{ a: 1 }, "x"]), [{ a: 1 }, { value: "x" }]);
});

test("renders a link with the button text on the server", async () => {
  const app = createSSRApp(Vue3JsonToExcel, { jsonData: [{ a: 1 }], buttonText: "Export" });
  assert.match(await renderToString(app), /<a href="#">Export<\/a>/);
});

test("app.use registers the component globally", () => {
  const app = createSSRApp({ render: () => null });
  app.use(Vue3JsonToExcel);
  assert.equal(app.component("Vue3JsonToExcel"), Vue3JsonToExcel);
});

test("bundles load in a browser without Node built-ins", () => {
  for (const file of ["vue3-json-to-excel.mjs", "vue3-json-to-excel.cjs", "vue3-json-to-excel.min.js"]) {
    const code = fs.readFileSync(new URL(`../dist/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(code, /^\s*import\s*['"](fs|crypto|stream)['"]/m, file);
    assert.doesNotMatch(code, /from\s*['"](fs|crypto|stream|xlsx)['"]/, file);
  }
});
