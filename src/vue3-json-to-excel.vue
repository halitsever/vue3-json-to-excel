<script>
import { defineComponent } from "vue";
import XLSX from "xlsx";

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
      var rows = XLSX.utils.json_to_sheet([this.jsonData]);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, rows);
      XLSX.writeFile(wb, this.fileNameAndExtension);
    },
  },
  props: {
    buttonText: { type: String, required: false },
    jsonData: { type: Object, required: true },
    fileName: { type: String, required: false },
  },
});
</script>

<template>
  <a :onclick="exportData" href="#">{{
    buttonText === undefined ? defaultButtonText : buttonText
  }}</a>
</template>
