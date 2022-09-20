<template>
  <div
    class="fill image-editor-container"
  >
    <div style="display:flex;flex-direction:column;left:2em;top:2em;position:absolute;max-height: 25em;max-width: 25em;z-index:1;">
      <canvas
        id="fred"
        ref="otherCanvas"
        crossorigin="anonymous"
        style="display:none;"
        :height="375"
        :width="375"
      />
    </div>

    <div class="image-spacer" />

    <div
      class="flex flex-column"
      style="height:100%;"
    >
      <div class="image-spacer" />

      <div style="display:flex;height:25em;">
        <div style="display:flex;height:100%;position:relative;">
          <div class="image-spacer" />
          <div
            class="absolute-container"
          >
            <img
              ref="image"
              class="image-preview-img"
              :src="imgSrc"
              :style="{
                transform: isWide ? tranlslateX : translateY,
                width: containerWidth,
                height: containerHeight,
              }"
            >
          </div>  
          <div
            ref="image-preview-pane"
            class="image-preview"
          >
            <div
              ref="scroll-panel"
              class="image-preview-mask"
              :style="{ 
                width,
                height: containerHeight,
                overflowX,
                overflowY
              }"
            >
              <div style="background-color: transparent;">
                <div class="flex">
                  <div 
                    class="image-preview-lens"
                    style="flex:1;"
                  >
                    <div
                      ref="image-editor-lens"
                      :style="{width, height}"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="image-spacer" />
      </div>
      <div class="image-spacer" />
    </div>
    <div class="image-spacer" />
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { axios, securePost } from '@/axios.js';
import { debounce } from 'vue-debounce';
import {IMAGE_MIME_TYPE} from '@/config';

const DEFAULT_LENS_SIZE = '25em';

export default {
  name:'ImageEditor',
  props:{
    imgSrc:{
      type: String,
      default:''
    },
    changeHandler:{
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    debounce: debounce((callback, val) => callback && callback(val), 20),
    offsetX: 0,
    offsetY: 0,
    imageWidth: 0,
    imageHeight: 0,
    actualWidth: 0,
    actualHeight: 0,
    isWide: true,
    anotherImgSrc:'',
    imageBlob: {}
  }),
  computed: {
    ...mapState('user', ['apiToken']),
    overflowX() {
      return this.isWide ? 'scroll' : 'hidden';
    },
    overflowY() {
      return this.isWide ? 'hidden' : 'scroll';
    },
    height() {
      return this.isWide ? DEFAULT_LENS_SIZE : `${this.imageHeight}px`; 
    },
    width() {
      return this.isWide ? `${this.imageWidth}px` : DEFAULT_LENS_SIZE;
    },
    tranlslateX() {
      return `translateX(${this.offsetX * -1}px)`;
    },
    translateY() {
      return `translateY(${(this.offsetY * 2) * -1}px)`;
    },
    containerHeight() {
      if(this.isWide)
        return '100%';
      else 
        return 'initial'
    },
    containerWidth(){
      return this.isWide ? 'inital' : '100%';
    }
  },
  watch:{
    imgSrc(){
      this.onImageChanged();
    }
  },
  async mounted() {
    this.$refs['scroll-panel'].addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    this.$refs['scroll-panel'].removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    uploadImage() {
      const ctx = this.$refs['otherCanvas'].getContext("2d");
      ctx.clearRect(0, 0, this.actualWidth, this.actualHeight);

      const theBestSprite = new Image();
      theBestSprite.crossOrigin="anonymous";
      theBestSprite.onload = e => {
        const dy = (this.actualHeight * this.offsetY)/this.imageHeight;
        var ratio = this.actualWidth / this.actualHeight;
        var width = this.imageWidth;
        var height = width / ratio;
        
        ctx.drawImage(theBestSprite, -1 * this.offsetX, (dy * -1)/2, width, height);

        this.$nextTick(() => {
          this.$refs['otherCanvas'].toBlob( async blob => {
            const file = new File([blob], 'fakename.png', {type: IMAGE_MIME_TYPE});
            this.changeHandler(file);
          });
        });
      };

      theBestSprite.src = this.imgSrc;
    },

    async onImageChanged() {

      Vue.set(this, 'imageBlob', new Image());
      this.imageBlob.crossOrigin = "anonymous";
      
      const result = await this.loadImage({sprite: this.imageBlob});

      const {width, height} = result;
      this.actualWidth = width;
      this.actualHeight = height;
      this.isWide = width > height;

      this.$nextTick(() => {
        const {scrollWidth, scrollHeight} = this.$refs['image'];

        this.imageWidth = scrollWidth;
        this.imageHeight = scrollHeight;

        this.$nextTick(() => {
          this.uploadImage();
        });
      });
    },

    handleScroll({target:{scrollLeft:offsetX, scrollTop:offsetY}}){
      this.debounce && this.debounce(() => this.handleScrollDebounce({offsetX, offsetY}));
    },
  
    handleScrollDebounce({offsetX, offsetY}){
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.uploadImage();
    },

    loadImage({sprite}){
      const self = this;
      return new Promise((resolve, reject) => {
        sprite.addEventListener("load", () => {
          try{
            return resolve(sprite);
          } catch(e) {
            return reject(sprite);
          }
        });
        sprite.src = self.imgSrc;
      });
    },
  }
}
</script>
<style  lang="scss">

.image-spacer {
  width: 100%;
  height: 100%;
  z-index: 1;
  flex: 1;
  background-color: rgb(31 25 25 / 77%);
}

.image-editor-container {
  display:flex;
  align-items:center;
  justify-content:center;
}

.image-preview-img{
  transition: all 300ms;
}

.image-preview {
  height: 25em;
  width: 25em;
  max-height: 25em;
  max-width: 25em;
  display:flex;

  position:relative;
  display:flex;
  background-color: transparent;

  .image-preview-mask {
    z-index:1;
    // overflow-x: scroll;
    // overflow-y: hidden;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    height: 25em;
  }

  .image-preview-lens {
    height:100%;    
    &>img {
      height: 100%;
    }
  }
}
</style>