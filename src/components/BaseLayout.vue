<template>
<div style="color:#66FF00;" @mousemove="onMouseMove">
 
 <div class="css-selector">
    <Header/>
    <Navigation/>
  </div>

  <div 
    class="css-selector"
    style="width:100%;display:flex;flex-direction:column;overflow-y:auto;height: calc(100vh - 172px)"
  >
    <VisioConsole/>
  </div>


</div>
</template>

<script>
import Navigation from './Navigation.vue';
import VisioConsole from './VisioConsole.vue';
import Header from './Header.vue'

export default {
  name: 'BaseLayout',
  components: {
    Navigation,
    VisioConsole,
    Header 
  },
  props: {
    msg: String
  },
  data: () => ({
    position:{x:0,y:0},
    items: [
      { id: 1, name:'Green Streets'},
      { id: 2, name:'Purple Streets'},
      { id: 3, name:'Blue Cubic Kit'},
      { id: 4, name:'Neon Vegetable'},
      { id: 5, name:'Swanky Salmon'},
      { id: 6, name:'Sick Smoke'}
    ]
  }),
  async mounted(){
    // Query Backend
    // const {data} = await this.$http.request({
    //   url: "http://visiophone.wtf/search/asdf",
    //   headers: {'Access-Control-Allow-Origin': '*'}
    // });
  },
  methods:{
    onMouseMove(){

    }
  }
}
</script>

<!-- TODO Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">


.alt-list {
  &:nth-child(even) {
    background-color:#323232;
  }
}

.play {
  box-sizing: border-box;
  height: 74px;
  
  border-color: transparent transparent transparent #66FF00;
  transition: 100ms all ease;
  will-change: border-width;
  cursor: pointer;

  // play state
  border-style: solid;
  border-width: 37px 0 37px 60px;
}

.container {
  position:absolute;
  top:0;left:0;bottom:0;right:0;
  display:flex;
  align-items: center;
  background-color:rgba(252, 252, 252, 0);

  &> *{
    flex:1;
  }

  .container-content{
    background-color:rgba(252, 252, 252, 0);
    display:flex;
    align-items: center;
  }
}

.image {
  flex:1;
  background-color:rgba(252, 252, 252, 0);
  transition: transform 0.24s linear 0s;
  &:hover{
    transform: scale(1.25, 1.25);
  }
}

.icon {
  width:2.5em;
  display:inline-block;
  padding-left:1em;
  cursor:pointer;
}

.hover-zoom {
    cursor: pointer;
    transition: transform 0.1s linear 0s;

    &:hover{
      transform: scale(1.25, 1.25);
      color: rgb(255, 51, 153);
    }
}

.button {
  max-width:15em;
  display:inline-block;
  position:relative;

  cursor:pointer;
  transition: transform 0.24s linear 0s;

  .button-text{
    font-size: 0.75em;
    position:absolute;
    top:0;bottom:0;left:0;right:0;
    display:flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0.1em;
  }

  &:hover{
    transform: scale(1.25, 1.25);
  }
  
}

.card {
  min-width: 1em;
  min-height: 1em;
}

.fancy{
    background-blend-mode: hard-light;
    animation: hue-rotate 3s linear infinite;
}

@keyframes hue-rotate {
  from {
    -webkit-filter: hue-rotate(0);
    -moz-filter: hue-rotate(0);
    -ms-filter: hue-rotate(0);
    filter: hue-rotate(0);
  }
  to {
    -webkit-filter: hue-rotate(360deg);
    -moz-filter: hue-rotate(360deg);
    -ms-filter: hue-rotate(360deg);
    filter: hue-rotate(360deg);
  }
}

</style>
