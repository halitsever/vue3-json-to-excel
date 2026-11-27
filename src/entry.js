import component, * as namedExports from "./entry.esm.js";

/** CJS and IIFE expose one value, so named exports ride on the component. */
Object.entries(namedExports).forEach(([exportName, exported]) => {
  if (exportName !== "default") component[exportName] = exported;
});

export default component;
