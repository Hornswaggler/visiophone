<template>
  <div>
    <div style="display:flex;">
      <div
        ref="flexEl"
        :style="currentFlexStyle"
      />
      <img
        :style="currentImgStyle"
        :src="currentImgSrc"
      >
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
<script>
const walking = new URL('../../assets/Walking_Animation_Visio_Lad.gif', import.meta.url).href
const idle = new URL('../../assets/boy_idle_anim.gif', import.meta.url).href

export default {
  name:'VisioMan',
  data: () => ({
    isGrow: false,
    currentFrame: 3,
    currentFlexStyle: {flexGrow: 0, transition: 'flex-grow 3s linear 0s'},
    currentImgStyle: {transform: 'scaleX(1)'},
    currentImgSrc: walking,
    frames: [
      { 
        imgSrc: walking,
        flexStyle:{flexGrow: 1, transition: 'flex-grow 3s linear 0s'},
        imgStyle: {transform: 'scaleX(1)'}
      },
      {
        imgSrc: idle,
        flexStyle:{flexGrow: 1, transition: 'flex-grow 3s linear 0s'},
        imgStyle: {transform: 'scaleX(1)'},
        idle: 5000
      },
      { 
        imgSrc: walking,
        transition: 'flex-grow 3s linear 0s',
        flexStyle:{flexGrow: 0, transition: 'flex-grow 3s linear 0s'},
        imgStyle: {transform: 'scaleX(-1)'},
      },
      {
        imgSrc: idle,
        flexStyle:{flexGrow: 0, transition: 'flex-grow 3s linear 0s'},
        imgStyle: {transform: 'scaleX(-1)'},
        idle: 5000
      },
    ]
  }),
  mounted() {
    this.$refs.flexEl.addEventListener('transitionend', this.cueNextFrame);
    this.cueFrame(this.currentFrame);
  },
  unmounted() {
    this.$refs.flexEl.removeEventListener('transitionend', () => this.cueNextFrame);
  },
  methods: {
    cueNextFrame() {
      this.cueFrame(this.currentFrame + 1 >= this.frames.length ? 0 : this.currentFrame + 1);
    },
    cueFrame(index) {
      const nextFrame = this.frames[index];
      this.currentFrame = index;
      this.currentFlexStyle = nextFrame.flexStyle;
      this.currentImgStyle = nextFrame.imgStyle;
      this.currentImgSrc = nextFrame.imgSrc;

      if(nextFrame.idle) setTimeout(() => {
        this.cueNextFrame();
      }, nextFrame.idle)
    }
  }

}
</script>
<style lang="scss">
</style>