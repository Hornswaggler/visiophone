<template>
  <div
    class="fill image-editor-container"
  >
    <div ref="resize-canvas-container">
      <canvas
        id="fred"
        ref="otherCanvas"
        crossorigin="anonymous"
        style="display:none;"
        :height="imageWidth > imageHeight ? imageHeight : imageWidth"
        :width="imageWidth > imageHeight ? imageHeight : imageWidth"
      />
    </div>

    <div class="image-spacer" />
    <div
      class="flex flex-column"
      style="height:100%;"
    >
      <div class="image-spacer" />

      <div style="display:flex;height:var(--image-editor-hw);">
        <div style="display:flex;height:100%;position:relative;">
          <div class="image-spacer" />
          <div class="absolute-container">
            <img
              ref="image"
              class="image-preview-img"
              :src="internalImgSrc"
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
                overflowX,
                overflowY
              }"
            >
              <div
                style="background-color: transparent;"
                :style="{height, width}"
              >
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
import { debounce } from 'vue-debounce';
import {IMAGE_MIME_TYPE} from '@/config';

const DEFAULT_LENS_SIZE = 'var(--image-editor-hw)';
const IMAGE_HW = "var(--image-editor-hw)";



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
    imageBlob: {},
    internalImgSrc: '',
    containerWidth: 'initial',
    containerHeight: '100%',
    theBestSprite: {}
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
      return `translateY(calc(${(this.offsetY * 2) * -1}px)`;
    },
  },
  watch:{
    imgSrc(){
      this.imgSourceChanged();
    }
  },
  async mounted() {
    this.$refs['scroll-panel'].addEventListener('scroll', this.handleScroll);
    this.$refs['image'].addEventListener('load', this.domImgLoaded)
  },
  beforeDestroy() {
    this.$refs['scroll-panel'].removeEventListener('scroll', this.handleScroll);
    this.$refs['image'].removeEventListener('load', this.domImgLoaded)

  },
  methods: {
    async domImgLoaded(ev){
      const {scrollWidth, scrollHeight} = ev.target;

      this.$nextTick(() => {
        this.imageWidth = scrollWidth;
        this.imageHeight = scrollHeight;

        this.$nextTick(() => {
          this.redrawImage();
        });
      })
    },
    
    async imgSourceChanged(){
      Vue.set(this, 'imageBlob', new Image());
      this.imageBlob.crossOrigin = "anonymous";

      const {width, height} = await this.loadImage({sprite: this.imageBlob});
      this.isWide = width > height;
      this.actualWidth = width;
      this.actualHeight = height;

      this.containerHeight = this.isWide ? '100%' : 'initial';
      this.containerWidth = this.isWide ?  'initial': '100%';
      
      this.$nextTick(() => {
        this.internalImgSrc = this.imgSrc;
      });
    },
    
    onSpriteLoaded(){
      const ctx = this.$refs['otherCanvas'].getContext("2d");
      ctx.clearRect(0, 0, this.actualWidth, this.actualHeight);

      const self = this;

      var ratio = this.actualWidth / this.actualHeight;
      var width = this.imageWidth;
      var height = width / ratio;

      ctx.drawImage(
        this.theBestSprite, -1 * this.offsetX,
        (this.offsetY * 2) * -1,
        width,
        height
      );

      this.$nextTick(() => {
        this.$refs['otherCanvas'].toBlob( async blob => {
          const file = new File([blob], 'fakename.png', {type: IMAGE_MIME_TYPE});
          this.changeHandler(file);
        });
      });
    },

    redrawImage() {
      Vue.set(this, 'theBestSprite', new Image());
      this.theBestSprite.crossOrigin="anonymous";
      this.theBestSprite.onload = this.onSpriteLoaded;
      
      this.theBestSprite.src = this.imgSrc;
    },

    handleScroll({target:{scrollLeft:offsetX, scrollTop:offsetY}}){
      this.debounce && this.debounce(() => this.handleScrollDebounce({offsetX, offsetY}));
    },
  
    handleScrollDebounce({offsetX, offsetY}){
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.redrawImage();
    },

    loadImage({sprite}){
      const self = this;
      //TODO: This is sketchy...
      return new Promise((resolve, reject) => {
        sprite.addEventListener("load", (ev) => {
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
.resize-canvas-container {
  display: flex;
    flex-direction: column;
    right: 0;
    left: 0;
    top: 0;
    bottom:0;
    position: absolute;
    height: var(--image-editor-hw);
    width: var(--image-editor-hw);
    z-index: 1;
}

.image-spacer {
  width: 100%;
  height: var(--image-editor-hw);
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
  height: var(--image-editor-hw);
  width: var(--image-editor-hw);
  max-height: var(--image-editor-hw);
  max-width: var(--image-editor-hw);
  display:flex;

  &.vp-form-row {
    font-size: 1em;
  }

  position:relative;
  display:flex;
  background-color: transparent;

  .image-preview-mask {


    &::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: rgba(17, 17, 17, 0);
  }

  &::-webkit-scrollbar
  {
    width: 12px;
    background-color: rgba(17, 17, 17, 0.7);
  }

  &::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: rgba(85, 85, 85, 0.7);
  }

    z-index:1;

    display:flex;
    justify-content: flex-start;
    align-items: center;
    height: var(--image-editor-hw);
    width: var(--image-editor-hw);
  }

  .image-preview-lens {
    height:100%;    
    &>img {
      height: 100%;
    }
  }
}
</style>