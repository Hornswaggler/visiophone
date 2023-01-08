<template>
  <div
    class="carousel"
  >
    <carousel-item
      :url="elements[currentIndex]"
      initialState="SHOW"
      :show="loaded"
    ></carousel-item>
    <carousel-item
      :url="elements[currentIndex + 1]"
      :show="!loaded"
    ></carousel-item>
  </div>


</template>
<script>
import Vue from 'vue';
import CarouselItem from './CarouselItem.vue';

export default {
  name:'Carousel',
  components: {
    CarouselItem
  },
  data: () => ({
    interval: 10000,
    intervalFunction: () => {},
    loaded: true,
    showPrimaryBuffer: true,
    currentIndex: 0,
    elements: [
      'http://localhost:8080/Visioland_text.png',
      'http://localhost:8080/crispy.png',
    ]
  }),
  mounted(){
    Vue.set(this, 'intervalFunction', setInterval(() => {
      console.log('FIRED!');
      this.loaded = !this.loaded;
      const nextIndex = this.currentIndex + 2;
      if(nextIndex % 2 === 0 && nextIndex < elements.length) {
        
      }
    }, this.interval));
  },
  destroyed(){
    if(this.intervalFunction){
      clearInterval(this.intervalFunction);
    }
  }
}
</script>
<style lang="scss">
.intro {
  background-blend-mode: hard-light;
  animation: hue-rotate 3s linear infinite;
}

.carousel {
  width:100%;
  height:100%;
  position:relative;
  overflow: hidden;
  
}
</style>