<template>
  <div id="app" style="height:100vh;">
    <div style="position:absolute;height:100vh;width:100vw;z-index:50;opacity:0.9;">
      <BaseLayout/>
    </div>
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="50"
      shapeType="circle"
      :particleSize="80"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      style="height:100%"
    >
    </vue-particles>
    
  </div>
</template>

<script>
 import BaseLayout from './components/BaseLayout.vue';

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
  background:url('./assets/purpletown.jpg')
}

html{
  background-color: black;
  height:100%;

  .css-selector {
    // opacity:0.5;
    background: linear-gradient(270deg, #00ffbd, #ff00f5);
    background-size: 1200% 1200%;

    -webkit-animation: animation-name 20s ease infinite;
    -moz-animation: animation-name 20s ease infinite;
    animation: animation-name 20s ease infinite;
  }

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

@-webkit-keyframes animation-name {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
@-moz-keyframes animation-name {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
@keyframes animation-name {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}

</style>
