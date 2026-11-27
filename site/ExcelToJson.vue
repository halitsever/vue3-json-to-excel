<script setup>
import { computed, ref, shallowRef } from 'vue';
import * as XLSX from 'xlsx';

const ACCEPT = '.xlsx,.xlsm,.xlsb,.xls,.ods,.csv';
const SAMPLE_NAME = 'orders-sample';

const workbook = shallowRef(null);
const sheetName = ref('');
const fileName = ref('');
const readError = ref('');
const dragging = ref(false);
const emptyAsNull = ref(false);
const nest = ref(false);
const copied = ref(false);

/** Undoes what the JSON to Excel side does: dotted headers become nested objects, JSON text cells are parsed. */
function unflatten(row) {
  const out = {};
  Object.keys(row).forEach((key) => {
    let value = row[key];
    if (typeof value === 'string' && /^\s*[[{]/.test(value)) {
      try {
        value = JSON.parse(value);
      } catch {
        // Not JSON after all, keep the text.
      }
    }
    const parts = key.split('.');
    let node = out;
    for (let i = 0; i < parts.length - 1; i++) {
      if (node[parts[i]] === null || typeof node[parts[i]] !== 'object') node[parts[i]] = {};
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
  });
  return out;
}

/** Dates at midnight UTC are plain calendar dates in the sheet, so they lose the time part. */
function dateText(_key, value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/.test(value)) return value.slice(0, 10);
  return value;
}

const result = computed(() => {
  if (!workbook.value || !sheetName.value) return null;
  const sheet = workbook.value.Sheets[sheetName.value];
  const options = { UTC: true };
  if (emptyAsNull.value) options.defval = null;
  let rows = XLSX.utils.sheet_to_json(sheet, options);
  if (nest.value) rows = rows.map(unflatten);
  return { rows, text: JSON.stringify(rows, dateText, 2) };
});

function download() {
  if (!result.value) return;
  const url = URL.createObjectURL(new Blob([result.value.text + '\n'], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = (fileName.value || 'output') + '.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function open(data, name) {
  readError.value = '';
  try {
    const book = XLSX.read(data, { cellDates: true });
    workbook.value = book;
    sheetName.value = book.SheetNames[0] || '';
    fileName.value = name;
  } catch (e) {
    workbook.value = null;
    readError.value = `This file could not be read as a spreadsheet: ${e.message}`;
  }
}

async function load(file) {
  if (!file) return;
  open(await file.arrayBuffer(), file.name.replace(/\.[^.]+$/, ''));
}

function loadSample() {
  const sheet = XLSX.utils.aoa_to_sheet([
    ['order', 'customer', 'total', 'paid', 'ordered', 'shipping.city', 'shipping.country', 'items'],
    [1001, 'Acme Ltd', 249.9, true, new Date(Date.UTC(2026, 10, 2)), 'Berlin', 'DE', '["keyboard","mouse"]'],
    [1002, 'Globex', 89.5, false, new Date(Date.UTC(2026, 10, 5)), 'Lyon', 'FR', '["monitor"]'],
    [1003, 'Initech', 1200, true, null, 'Austin', 'US', '[]'],
  ], { UTC: true });
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Orders');
  open(XLSX.write(book, { type: 'array', bookType: 'xlsx' }), SAMPLE_NAME);
}

function onPick(event) {
  load(event.target.files[0]);
  event.target.value = '';
}

function onDrop(event) {
  dragging.value = false;
  load(event.dataTransfer.files[0]);
}

async function copy() {
  if (!result.value) return;
  await navigator.clipboard.writeText(result.value.text);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <div class="tool">
    <div class="tool-input">
      <div class="tool-bar">
        <span class="tool-label">Excel file</span>
        <div class="tool-actions">
          <button type="button" class="btn btn-ghost" @click="loadSample">Sample</button>
        </div>
      </div>
      <label
        class="dropzone"
        :class="{ dragging }"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="onDrop"
      >
        <span class="dropzone-title">{{ fileName ? 'Open another file' : 'Choose an Excel file' }}</span>
        <span class="dropzone-hint">or drop it here: .xlsx, .xls, .xlsm, .xlsb, .ods or .csv</span>
        <input type="file" :accept="ACCEPT" class="visually-hidden" @change="onPick" />
      </label>
      <p v-if="fileName" class="tool-hint">Opened: {{ fileName }}</p>

      <div v-if="workbook" class="tool-options">
        <label v-if="workbook.SheetNames.length > 1" class="tool-select">
          <span class="tool-label">Sheet</span>
          <select v-model="sheetName">
            <option v-for="name in workbook.SheetNames" :key="name" :value="name">{{ name }}</option>
          </select>
        </label>
        <label class="tool-check">
          <input v-model="emptyAsNull" type="checkbox" />
          <span>Write empty cells as <code>null</code></span>
        </label>
        <label class="tool-check">
          <input v-model="nest" type="checkbox" />
          <span>Turn <code>a.b</code> headers into nested objects and parse JSON text cells</span>
        </label>
      </div>
    </div>

    <div class="tool-output">
      <div class="tool-bar">
        <span class="tool-label">JSON</span>
        <div class="tool-actions">
          <button type="button" class="btn btn-ghost" :disabled="!result" @click="copy">
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
          <button type="button" class="btn btn-primary" :class="{ 'is-disabled': !result }" :disabled="!result" @click="download">
            Download .json
          </button>
        </div>
      </div>
      <p v-if="readError" class="tool-status is-error" role="status">{{ readError }}</p>
      <p v-else-if="result" class="tool-status" role="status">
        {{ result.rows.length }} {{ result.rows.length === 1 ? 'row' : 'rows' }} from sheet "{{ sheetName }}"
      </p>
      <p v-else class="tool-status" role="status">Open a spreadsheet to see its first sheet as JSON.</p>
      <textarea
        readonly
        spellcheck="false"
        aria-label="JSON output"
        :value="result ? result.text : ''"
        placeholder='[{ "name": "Ada", "city": "London" }]'
      ></textarea>
    </div>
  </div>
</template>
