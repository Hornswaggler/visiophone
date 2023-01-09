<template>
  <div
    ref="carouselItem"
    class="carousel-item"
    :style="{
      background: `url(${url}) no-repeat center`,
      transform: `translateX(${transitionState.translateX})`,
      opacity: `${opacity}`
    }"
  >
  </div>
</template>
<script>

const TRANSITION_IN = "TRANSITION_IN";
const SHOW = "SHOW";
const TRANSITION_OUT = "TRANSITION_OUT";

const TRANSITION_STATES = {
  [TRANSITION_IN]: {
    name: TRANSITION_IN,
    translateX: '100%'
  },
  [SHOW]: {
    name: SHOW,
    translateX: '0%'
  },
  [TRANSITION_OUT]: {
    name: TRANSITION_OUT,
    translateX: '-100%'
  },
};

export default {
  name: 'CarouselItem',
  
  data: () => ({
    transitionState: TRANSITION_STATES[TRANSITION_IN],
    opacity: 1
  }),
  props:{
    url: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    initialState: {
      type: String,
      default: TRANSITION_IN
    }
  },
  watch:{
    show(newShow) {
      if(newShow) {
        this.transitionState = TRANSITION_STATES[SHOW];
      } else {
        this.transitionState = TRANSITION_STATES[TRANSITION_OUT];
      }
    }
  },
  mounted() {
    this.$refs['carouselItem'].addEventListener('transitionend', this.onTransitionEnd);
    this.transitionState = TRANSITION_STATES[this.initialState];
  },
  beforeDestroy(){
    this.$refs['carouselItem'].removeEventListener('transitionend', this.onTransitionEnd);
  },
  methods:{
    onTransitionEnd(event){
      if(this.transitionState.name === TRANSITION_IN) {
        this.opacity = 1;
      }
      if(this.transitionState.name === TRANSITION_OUT){
        this.transitionState = TRANSITION_STATES[TRANSITION_IN];
        this.opacity = 0;
      } 
    }
  }
}

</script>
