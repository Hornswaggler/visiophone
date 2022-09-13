<template>
  <div style="display:flex;height:30em;">
    <div style="z-index:1;flex:1;background-color:rgb(31 25 25 / 77%);" />
    <div
      ref="image-preview-pane"
      class="image-preview"
      style="
      position:relative;
      display:flex;
      background-color: transparent;"
    >
      <div
        style="
        background-color:orange;
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;"
      >
        <img
          ref="imager"
          class="image-preview-img"
          :src="imgSrc"
          :style="{
            transform: tranlslateX,
            width: image.width,
            height: image.height,
          }"
        >
      </div>
      <div
        ref="scroll-panel"
        class="image-preview-mask"
        style="
          z-index:1;
          overflow-x: scroll;
          overflow-y: hidden;
          display:flex;
          justify-content: flex-start;
          align-items: center;"
      >
        <div style="height:100%;background-color: transparent;">
          <div style="display:flex;height:100%;">
            <div 
              class="image-preview-lens"
              style="flex:1;"
            >
              <div 
                style="height:30em;"
                :style="{width: `${imageWidth}px`}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="z-index:1;flex:1;background-color:rgb(31 25 25 / 77%);" />
  </div>
</template>
<script>
import { debounce } from 'vue-debounce'

export default {
  name:'ImageEditor',
  props:{
    imgSrc:{
      type: String,
      default:''
    }
  },
  data: () => ({
    debounce: debounce((callback, val) => callback && callback(val), 50),
    offsetX: 0,
    imageWidth: 0,
    image: {
      id: 1,
      height: '100%',
      width: 'inital',
    }
  }),
  computed: {
    tranlslateX(){
      return `translateX(${this.offsetX * -1}px)`;
    },
  },
  async mounted(){
    const sprite = new Image();
    sprite.src = this.imgSrc;
    await this.loadImage({sprite});

    this.imageWidth = this.$refs['imager'].scrollWidth;
    this.$refs['scroll-panel'].addEventListener('scroll', this.handleScrollX);
  },
  beforeDestroy(){
    this.$refs['scroll-panel'][0].removeEventListener('scroll', this.handleScrollX);
  },
  methods: {
    handleScrollX(evt){
      this.debounce && this.debounce(this.handleScrollXDebounce(evt));
    },
    handleScrollXDebounce(evt){
      this.offsetX = evt.target.scrollLeft;
    },
    loadImage({sprite}){
      return new Promise((resolve, reject) => {
        sprite.addEventListener("load", () => {
          // TODO handle this
          try{
            return resolve(sprite);
          } catch(e) {
            return reject(sprite);
          }
        });
      });
    },
  }
}
</script>

<style  lang="scss">
.image-preview-img{
  transition: all 400ms;
}

.image-preview {
  height: 25em;
  width: 25em;
  max-height: 25em;
  max-width: 25em;
  background-color: rgb(31 25 25 / 77%);
  display:flex;

  .image-preview-mask {
    z-index:1;
    overflow-x: scroll;
    overflow-y: hidden;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    height: 30em;
  }

  .image-preview-lens {
    height:100%;    
    &>img {
      height: 100%;
    }
  }
}
</style>