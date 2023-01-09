<template>
  <div
    class="carousel"
  >
    <carousel-item
      :url="primaryBuffer[primaryIndex]"
      initialState="SHOW"
      :show="showPrimaryBuffer"
    ></carousel-item>
    <carousel-item
      :url="secondaryBuffer[secondaryIndex]"
      :show="!showPrimaryBuffer"
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
    showPrimaryBuffer: true,
    primaryIndex: 0,
    secondaryIndex: 0,
    primaryBuffer:[],
    secondaryBuffer: []
  }),
  props:{
    elements: {
      type: Array,
      default: []
    }
  },
  mounted() {
    for(let i = 0; i < this.elements.length; i++){
      if(i % 2 === 0) {
        this.primaryBuffer.push(this.elements[i]);
      } else {
        this.secondaryBuffer.push(this.elements[i]);
      }
    }

    Vue.set(this, 'intervalFunction', setInterval(() => {
      if(document.hasFocus()) {
        this.showPrimaryBuffer = !this.showPrimaryBuffer;

        if(!this.showPrimaryBuffer){
          this.secondaryIndex = this.secondaryIndex + 1 >= this.secondaryBuffer.length ? 0 : this.secondaryIndex + 1 ;
        } else {
          this.primaryIndex = this.primaryIndex + 1 >= this.primaryBuffer.length ? 0 : this.primaryIndex + 1 ;
        }
      }
    }, this.interval));
  },
  beforeDestroy(){
    if(this.intervalFunction){
      clearInterval(this.intervalFunction);
    }
  }
}
</script>
