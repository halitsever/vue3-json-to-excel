import type { DefineComponent, Plugin } from "vue";

export interface Vue3JsonToExcelProps {
  /** One object (one row) or an array of objects (one row each). */
  jsonData: Record<string, unknown> | unknown[];
  /** File name without the extension. Defaults to `output`. */
  fileName?: string;
  /** Link text. Defaults to `Download`. */
  buttonText?: string;
}

/** Flattens `jsonData` into the rows written to the sheet. Nested keys become dotted column names. */
export declare function toRows(jsonData: unknown): Record<string, unknown>[];

declare const Vue3JsonToExcel: DefineComponent<Vue3JsonToExcelProps> & Plugin & { toRows: typeof toRows };

export default Vue3JsonToExcel;
