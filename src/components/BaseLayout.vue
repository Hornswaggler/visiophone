<template>
<div style="color:#66FF00;" @mousemove="onMouseMove">
 
 <div class="css-selector">

    <!-- header -->
    <div class="fred" style="height:100px;width:100%;display:flex;justify-content:flex-left;padding:1em;">
      <img style="height:100%;" src="../assets/Animated-Visio-Man.gif"/>
      
      <!-- xp bar -->
      <div style="width:15em;display:flex;flex-direction:column;align-items:flex-start;padding-left:1em;justify-content:center;">
        <div>Visiodiamonds:420&#9830;</div>
        <div style="width:75%;height:1em;background-color:grey;margin-top:0.25em;">
          <div style="height:100%;width:75%;background-color:#FF3399"></div>
        </div>
      </div>
      <div style="flex:0.3"></div>
      <div style="width:15em;display:flex;flex-direction:column;align-items:flex-start;padding-left:1em;justify-content:center;">
        <visio-man>
          <input style="height:2em;width:25em;" type="text"/>
        </visio-man>
      </div>
    </div>

    <!-- Nav -->
    <div style="width:100%;" class="HereIam">
      <!-- <div style="width:100%;height:2em;background-color:rgb(56 56 56);"></div> -->
      <div style="width:100%;height:2em;color:white;padding-top:0.5em;">
        <div style="display:flex;justify-content:space-around; font-family: 'Helvetica', 'Arial', sans-serif;">
          <div class="hover-zoom" style="color:#66FF00;">loops</div>
          <div class="hover-zoom">one-shots</div>
          <div class="hover-zoom">packs</div>
          <div class="hover-zoom">featured</div>
          <div class="hover-zoom">tags</div>
          <div class="hover-zoom">most downloaded</div>
          <div class="hover-zoom">random</div>
          <div class="hover-zoom">submit</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Body -->
  <div 
    class="css-selector"
    style="width:100%;display:flex;flex-direction:column;overflow-y:auto;height: calc(100vh - 132px)"
  >
    <drag-bubble-container>
      <drag-bubble/>
      <drag-bubble/>
      <drag-bubble/>
    </drag-bubble-container>
  </div>


</div>
</template>

<script>
import DragBubble from './DragBubble.vue';
import DragBubbleContainer from './DragBubbleContainer.vue';
import VisioMan from './VisioMan.vue';

export default {
  name: 'BaseLayout',
  components: {
    DragBubble,
    DragBubbleContainer,
    VisioMan
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
  methods:{
    onMouseMove(){

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
      color:#66FF00;
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
