<template>
  <div id="app" >
    <BaseLayout msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
 import BaseLayout from './components/BaseLayout.vue'

export default {
  name: 'App',
  components: {
    BaseLayout
  }
}
</script>

<style lang="scss">
#app {
  font-family: "VCR_OSD_MONO";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin:0;
  color:white;
}

html{
  background-color: black;
  height:100%;
  
  body{
    margin:0;
    height:100%;
    color: #65FE00;
    overflow:hidden;
  }
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

@font-face {
  font-family: "VCR_OSD_MONO";
  src: url("./assets/VCR_OSD_MONO_1.001.ttf");
}


</style>
