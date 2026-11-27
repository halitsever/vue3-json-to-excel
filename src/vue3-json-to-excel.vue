<script>
import { defineComponent } from "vue";
import { utils, writeFile } from "xlsx";

/** SheetJS cannot write an object into a cell, so nested keys become dotted column names. */
function flatten(value, prefix, out) {
  Object.keys(value).forEach((key) => {
    const path = prefix ? prefix + "." + key : key;
    const item = value[key];
    if (Array.isArray(item)) out[path] = JSON.stringify(item);
    else if (item !== null && typeof item === "object") flatten(item, path, out);
    else out[path] = item;
  });
  return out;
}

/** Turns `jsonData` (one object or an array of objects) into the flat rows written to the sheet. */
export function toRows(jsonData) {
  const list = Array.isArray(jsonData) ? jsonData : [jsonData];
  return list.map((row) =>
    row !== null && typeof row === "object" && !Array.isArray(row)
      ? flatten(row, "", {})
      : { value: row }
  );
}

export default /*#__PURE__*/ defineComponent({
  name: "Vue3JsonToExcel",
  data() {
    return {
      fileNameAndExtension: "output.xlsx",
      defaultButtonText: "Download",
    };
  },
  methods: {
    exportData() {
      if (this.jsonData === undefined) return;
      this.fileName === undefined
        ? (this.fileNameAndExtension = "output.xlsx")
        : (this.fileNameAndExtension = this.fileName + ".xlsx");
      var rows = utils.json_to_sheet(toRows(this.jsonData));
      var wb = utils.book_new();
      utils.book_append_sheet(wb, rows);
      writeFile(wb, this.fileNameAndExtension);
    },
  },
  props: {
    buttonText: { type: String, required: false },
    jsonData: { type: [Object, Array], required: true },
    fileName: { type: String, required: false },
  },
});
</script>

<template>
  <a @click.prevent="exportData" href="#">{{
    buttonText === undefined ? defaultButtonText : buttonText
  }}</a>
</template>
