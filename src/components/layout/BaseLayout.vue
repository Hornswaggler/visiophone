<template>
  <div>
    <div style="z-index:-2">
      <div class="overlay">
        <background />
      </div>
    </div>
    <form-dropdown />
    <loading />
    <router-view />
  </div>
</template>

<script>
import Loading from '@/components/layout/Loading.vue';
import FormDropdown from '../form/FormDropdown.vue';
import Background from './Background.vue';

export default {
  name: 'BaseLayout',
  components: {
    Loading,
    FormDropdown,
    Background
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
  background-color:transparent;

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
  animation: hue-rotate 30s linear infinite;
}

@keyframes hue-rotate {
  from {
    -webkit-filter: hue-rotate(0);
    -moz-filter: hue-rotate(0);
    -ms-filter: hue-rotate(0);
    filter: hue-rotate(0);
    // transform: rotate3d(1, 1, 1, 360deg);
  }
  to {
    -webkit-filter: hue-rotate(360deg);
    -moz-filter: hue-rotate(360deg);
    -ms-filter: hue-rotate(360deg);
    filter: hue-rotate(360deg);
    // transform: rotate3d(1, 1, 1, 0deg);
  }
}

</style>
