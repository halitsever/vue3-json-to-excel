<script setup>
import { computed, ref } from 'vue';
import Vue3JsonToExcel, { toRows } from 'vue3-json-to-excel';

const SAMPLE = `[
  {
    "order": 1001,
    "customer": "Acme Ltd",
    "total": 249.9,
    "paid": true,
    "shipping": { "city": "Berlin", "country": "DE" },
    "items": ["keyboard", "mouse"]
  },
  {
    "order": 1002,
    "customer": "Globex",
    "total": 89.5,
    "paid": false,
    "shipping": { "city": "Lyon", "country": "FR" },
    "items": ["monitor"]
  },
  {
    "order": 1003,
    "customer": "Initech",
    "total": 1200,
    "paid": true,
    "shipping": { "city": "Austin", "country": "US" },
    "items": []
  }
]`;

const PREVIEW_LIMIT = 50;

const source = ref(SAMPLE);
const fileName = ref('orders');
const dragging = ref(false);

const result = computed(() => {
  const text = source.value.trim();
  if (!text) return { error: 'Paste JSON above or upload a .json file.' };
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { error: `This is not valid JSON: ${e.message}` };
  }
  if (data === null || typeof data !== 'object') {
    return { error: 'Use a JSON object or an array of objects.' };
  }
  if (Array.isArray(data) && data.length === 0) return { error: 'The array is empty.' };

  const rows = toRows(data);
  // Same first-seen column order that SheetJS json_to_sheet writes.
  const columns = [];
  const seen = new Set();
  rows.forEach((row) =>
    Object.keys(row).forEach((key) => {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    })
  );
  return { data, rows, columns };
});

const downloadName = computed(() => fileName.value.trim().replace(/\.xlsx$/i, '') || 'output');

function cell(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  return String(value);
}

async function load(file) {
  if (!file) return;
  source.value = await file.text();
  fileName.value = file.name.replace(/\.[^.]+$/, '');
}

function onPick(event) {
  load(event.target.files[0]);
  event.target.value = '';
}

function onDrop(event) {
  dragging.value = false;
  load(event.dataTransfer.files[0]);
}
</script>

<template>
  <div class="tool">
    <div class="tool-input">
      <div class="tool-bar">
        <label for="json-input" class="tool-label">JSON</label>
        <div class="tool-actions">
          <label class="btn btn-ghost">
            Upload .json
            <input type="file" accept=".json,application/json" class="visually-hidden" @change="onPick" />
          </label>
          <button type="button" class="btn btn-ghost" @click="source = SAMPLE">Sample</button>
          <button type="button" class="btn btn-ghost" @click="source = ''">Clear</button>
        </div>
      </div>
      <textarea
        id="json-input"
        v-model="source"
        :class="{ dragging }"
        spellcheck="false"
        autocomplete="off"
        placeholder='[{ "name": "Ada", "city": "London" }]'
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="onDrop"
      ></textarea>
      <p class="tool-hint">You can also drop a .json file on the box.</p>
    </div>

    <div class="tool-output">
      <div class="tool-bar">
        <div class="tool-file">
          <label for="file-name" class="tool-label">File name</label>
          <input id="file-name" v-model="fileName" type="text" spellcheck="false" />
          <span class="tool-ext">.xlsx</span>
        </div>
        <Vue3JsonToExcel
          v-if="!result.error"
          class="btn btn-primary"
          :json-data="result.data"
          :file-name="downloadName"
          button-text="Download .xlsx"
        />
        <span v-else class="btn btn-primary is-disabled" aria-disabled="true">Download .xlsx</span>
      </div>

      <p v-if="result.error" class="tool-status is-error" role="status">{{ result.error }}</p>
      <template v-else>
        <p class="tool-status" role="status">
          {{ result.rows.length }} {{ result.rows.length === 1 ? 'row' : 'rows' }},
          {{ result.columns.length }} {{ result.columns.length === 1 ? 'column' : 'columns' }}<span
            v-if="result.rows.length > PREVIEW_LIMIT"
          >. Showing the first {{ PREVIEW_LIMIT }}.</span>
        </p>
        <div class="table-wrap">
          <table class="preview">
            <thead>
              <tr>
                <th v-for="column in result.columns" :key="column">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in result.rows.slice(0, PREVIEW_LIMIT)" :key="i">
                <td v-for="column in result.columns" :key="column" :class="{ num: typeof row[column] === 'number' }">
                  {{ cell(row[column]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>
