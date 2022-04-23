<p align="center">
<img src="https://i.ibb.co/dfP8BBk/Yeni-Proje-3.png" alt="Vue json to excel, vue 3"><br>
Component that lets you convert your Json objects into excel tables
<h1>Getting started:</h1>
Get the package:
<br>npm i vue vue3-json-to-excel

<h1>Usage:</h1>


    <vue3-json-to-excel :jsonData="{ hello: 'world', world: 'hello' }" />

<h1>Props:</h1>

| Name | Type |
|--|--|
| jsonData| Object|
| fileName| String |
| buttonText | String |


<h1>Full example:</h1>

    <script>
    
    import { defineComponent } from  'vue';
    
    import  Vue3JsonToExcel  from  '@/vue3-json-to-excel.vue';
    
      
    
    export  default  defineComponent({
    
    name:  'ServeDev',
    
    components: {
    
    Vue3JsonToExcel
    
    }
    
    });
    
    </script>
    
      
    
    <template>
    
    <div  id="app">
    
    <vue3-json-to-excel  fileName="myFile"  buttonText="Download Halit's excel file" :jsonData="{ hello:  'world', world:  'hello' }" />
    
    </div>
    
    </template>

</p>   