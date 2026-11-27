<p align="center" class="logo-section">
<img src="https://i.ibb.co/NrPh9xP/image.png" height="80" width="80" alt="vue3-json-to-excel logo"/>
<br/>
<img src="https://halitsever-api.vercel.app/api/repo-title?title=Vue3%20JSON%20to%20Excel">

<p align="center">
Vue 3 component that exports JSON to an Excel (.xlsx) file in the browser, built on SheetJS.<br>
Try it in the <a href="https://halitsever.github.io/vue3-json-to-excel/">online JSON to Excel converter</a>.<br>
<br/>
<br/>
<a href="https://www.npmjs.com/package/vue3-json-to-excel"><img src="https://img.shields.io/npm/v/vue3-json-to-excel" alt="npm version"/></a>
<a href="https://www.npmjs.com/package/vue3-json-to-excel"><img src="https://img.shields.io/npm/dm/vue3-json-to-excel" alt="npm downloads"/></a>
<a href="LICENSE"><img src="https://img.shields.io/github/license/halitsever/vue3-json-to-excel" alt="License"/></a>
<img src="https://img.shields.io/github/sponsors/halitsever" alt="GitHub sponsors"/>
</p>
<p align="center">
<a align="center" href="https://halitsever.github.io/vue3-json-to-excel/">Documentation</a>
  </p>
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/details"/>
</p>

- **JSON to Excel** - Pass an object or an array of objects and get a link that downloads it as an `.xlsx` sheet, with the keys as column headers
- **Nested data** - Nested objects become dotted columns such as `shipping.city`, and arrays inside an object go into one cell as JSON text
- **File name** - Set it with `fileName`, or keep the default `output.xlsx`
- **Link text** - Set it with `buttonText`, or keep the default `Download`
- **Runs in the browser** - The workbook is built with [SheetJS](https://sheetjs.com) on the client, no server needed
- **Global or local** - Register it with `app.use()` or import it into a single component
- **No extra dependencies** - SheetJS is bundled, so `vue` is the only thing you need next to it
- **TypeScript** - Types for the props and for `toRows` ship with the package

<p align="center" >
<img src="https://halitsever-api.vercel.app/api/installation"/>
</p>

Get the package:

```bash
npm i vue3-json-to-excel
```

Usage:

```vue
<vue3-json-to-excel :jsonData="{ hello: 'world', world: 'hello' }" />
```

Props:

| Name       | Type            | Required | Default                                  |
| ---------- | --------------- | -------- | ---------------------------------------- |
| jsonData   | Object or Array | yes      |                                          |
| fileName   | String          | no       | `output` (`.xlsx` is added to the name)  |
| buttonText | String          | no       | `Download`                               |

Full example:

```vue
<script>
import { defineComponent } from 'vue';
import Vue3JsonToExcel from 'vue3-json-to-excel';

export default defineComponent({
  name: 'ServeDev',
  components: {
    Vue3JsonToExcel
  }
});
</script>

<template>
  <div id="app">
    <vue3-json-to-excel fileName="myFile" buttonText="Download Halit's excel file" :jsonData="{ hello: 'world', world: 'hello' }" />
  </div>
</template>
```

Register it once for the whole app:

```js
import { createApp } from 'vue';
import Vue3JsonToExcel from 'vue3-json-to-excel';
import App from './App.vue';

createApp(App).use(Vue3JsonToExcel).mount('#app');
```

`toRows` is the function the component uses to flatten JSON into sheet rows. Import it to preview the same rows in a table:

```js
import { toRows } from 'vue3-json-to-excel';

toRows({ id: 1, shipping: { city: 'Berlin' } }); // [{ id: 1, 'shipping.city': 'Berlin' }]
```

<p align="center">
<a href="https://github.com/halitsever/vue3-json-to-excel/issues"><img src="https://halitsever-api.vercel.app/api/issue"/></a>
</p>

<p align="center">
Found a bug or have an idea? Open an <a href="https://github.com/halitsever/vue3-json-to-excel/issues">issue</a>.<br/>
Read the <a href=".github/CONTRIBUTING.md">contributing guide</a> before sending a pull request.
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/sponsor"/>
</p>

<p align="center">
<img src="https://halitsever-api.vercel.app/api/license"/>
</p>

<p align="center">
Released under the <a href="LICENSE">MIT License</a>.
</p>
