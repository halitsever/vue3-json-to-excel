<script>
import { defineComponent } from 'vue';
import Vue3JsonToExcel from '@/vue3-json-to-excel.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    Vue3JsonToExcel
  }
});
</script>

<template>
  <div id="app">
    <vue3-json-to-excel fileName="myFile" buttonText="Halit's excel file" :jsonData="{ hello: 'world', world: 'hello' }" />
  </div>
</template>
