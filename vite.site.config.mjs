import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/** Ships the repo's llms.txt with the site so there is one copy to keep current. */
const llmsTxt = {
  name: 'llms-txt',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'llms.txt',
      source: fs.readFileSync(path.resolve(import.meta.dirname, 'llms.txt'), 'utf8'),
    });
  },
};

export default defineConfig({
  root: 'site',
  base: '/vue3-json-to-excel/',
  plugins: [vue(), llmsTxt],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  build: {
    outDir: '../site-dist',
    emptyOutDir: true,
  },
});
