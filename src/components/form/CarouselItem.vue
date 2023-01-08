<template>
  <div
    ref="carouselItem"
    class="carousel-item"
    :style="{
      background: `url(${url}) no-repeat center`,
      transform: `translateX(${transitionState.translateX})`,
      opacity: `${opacity}`
    }"
    style="
      width: 100%;
      height: 100%;
      background-color: orange"
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
    show(newShow){
      console.log(newShow);
        if(newShow) {
        this.transitionState = TRANSITION_STATES[SHOW];
      } else {
        this.transitionState = TRANSITION_STATES[TRANSITION_OUT];
        //TODO: wait for animation end and then set back to TRANSITION_IN
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
      console.log(this.transitionState.name);

      // this.$nextTick(() => {
        
      // })
      this.$nextTick(() => {
        if(this.transitionState.name === TRANSITION_IN) {
          console.log('IN', this.initialState);
          this.opacity = 1;
        }
        if(this.transitionState.name === TRANSITION_OUT){
          console.log('OUT', this.initialState);
          this.transitionState = TRANSITION_STATES[TRANSITION_IN];
          this.opacity = 0;
        } 
      });


  
        
      

    }
  }
}

</script>
<style lang="scss">
  .carousel-item {
    position:absolute;
    top:0;
    bottom:0;
    left: 0;
    right: 0;
    transition:
      transform 2750ms ease-in-out
  }
</style>
