<template>
  <div class="form-image-editor-container">
    <div ref="form-image-editor-resize-container">
      <canvas
        id="fred"
        ref="otherCanvas"
        crossorigin="anonymous"
        class="hidden"
        :height="imageWidth > imageHeight ? imageHeight : imageWidth"
        :width="imageWidth > imageHeight ? imageHeight : imageWidth"
      />
    </div>
    <div class="form-image-editor-image-spacer">
      &nbsp;
    </div>    
    <div class="form-image-editor-preview-container position-relative">
      <div class="position-absolute">
        <img
          ref="image"
          class="form-image-editor-preview-img"
          :src="internalImgSrc"
          :style="{
            transform: isWide ? tranlslateX : translateY,
            width: containerWidth,
            height: containerHeight,
          }"
        >
      </div>  
      <div
        ref="form-image-editor-preview-pane"
        class="form-image-editor-preview"
      >
        <div
          ref="scroll-panel"
          class="form-image-editor-preview-mask"
          :style="{ 
            overflowX,
            overflowY
          }"
        >
          <div
            :style="{height, width}"
          >
            <div class="flex">
              <div class="form-image-editor-preview-lens flex-1">
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
    <div class="form-image-editor-image-spacer" />
  </div>
</template>
<script>
import Vue from 'vue';
import { debounce } from 'vue-debounce';
import {IMAGE_MIME_TYPE} from '@/config';

const DEFAULT_LENS_SIZE = 'var(--image-editor-hw)';

export default {
  name:'FormImageEditor',
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
    imageBlob: {},
    internalImgSrc: '',
    containerWidth: 'initial',
    containerHeight: '100%',
    theBestSprite: {},
    isLoading: true
  }),
  computed: {
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
      if(!this.isLoading) this.imgSourceChanged();
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.internalImgSrc = this.imgSrc;
      this.isLoading = false;

      this.$refs['scroll-panel'].addEventListener('scroll', this.handleScroll);
      this.$refs['image'].addEventListener('load', this.domImgLoaded);
    });
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
      if(!this.isLoading) {
        Vue.set(this, 'theBestSprite', new Image());
        this.theBestSprite.onload = this.onSpriteLoaded;
        this.theBestSprite.src = this.imgSrc;
      }
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