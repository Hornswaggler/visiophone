<template>
<div>
  <div
    v-if="title != ''"
    class="form-image-editor-title"
  >
      {{ title }}
  </div>
  <div class="form-image-editor-container">
    <div ref="form-image-editor-resize-container">
      <canvas
        class="hidden"
        ref="otherCanvas"
        crossorigin="anonymous"
        :height="imageWidth > imageHeight ? imageHeight : imageWidth"
        :width="imageWidth > imageHeight ? imageHeight : imageWidth"
      />
    </div>
    <div class="form-image-editor-image-spacer">
      &nbsp;
    </div>
    
    <div
      class="form-image-editor-preview-container"
      :class="{ ['show-icon']: imgPreviewSrc === ''}"
    >
      <div class="form-image-editor-file-input">
        <input
          type="file"
          :accept="IMAGE_MIME_TYPE"
          @change="({target:{files}}) => onInputChanged(files[0])"
        />
        <div class="image-icon noselect">
          <font-awesome-icon icon="fa-solid fa-image" />
        </div>
      </div>

      <div class="position-absolute fill flex ">
        <div class="position-absolute fill-height">
          <img
            ref="image"
            class="form-image-editor-preview-img"
            :src="imgPreviewSrc"
            :style="{
              transform: isWide ? tranlslateX : translateY,
              width: containerWidth,
              height: containerHeight,
            }"
          >
        </div>
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
            overflowY,
            cursor: isMousedown ? 'grab' : 'pointer'
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
  <div :class="{hasError}" class="form-input-error-container">
    <div 
      v-for="error in errors[fieldName]"
      :key="error.id"
      class="form-input-error"
    >
      {{error.msg}}
    </div>
  </div>
</div>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { debounce } from 'vue-debounce';
import {IMAGE_MIME_TYPE} from '@/config';

const DEFAULT_LENS_SIZE = 'var(--image-editor-hw)';

export default {
  name:'FormImageEditor',
  props:{
    value:{
      type: Object,
      default: {}
    },
    fieldName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    changeHandler:{
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    imgUrl:'',
    debounce: debounce((callback, val) => callback && callback(val), 250),
    offsetX: 0,
    offsetY: 0,
    imageWidth: 0,
    imageHeight: 0,
    actualWidth: 0,
    actualHeight: 0,
    isWide: true,

    imagePreviewBlob: {},
    imageBlob: {},
    imageFile: {},

    imgPreviewSrc: '',
    containerWidth: 'initial',
    containerHeight: '100%',
    IMAGE_MIME_TYPE,
    isMousedown: false,
    initialized: false,
  }),
  computed: {
    ...mapState('form', ['errors']),
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
    hasError(){
      if(this.errors != null && this.fieldName != null && this.errors[this.fieldName] != null){
        return ((this.errors[this.fieldName]) || []).length > 0;
      }
      return [];
    }
  },
  watch: {
    value() {
      if(this.initialized) this.imgSourceChanged();
    }
  },
  async mounted() {
    const {imgUrl, imageFile} = this.value;

    this.$refs['scroll-panel'].addEventListener('mousemove', ({movementX, movementY}) => {
      if(this.isMousedown) {
        this.$refs['scroll-panel'].scrollLeft -= movementX;
        this.$refs['scroll-panel'].scrollTop -= movementY;
      }
    });

    this.$refs['scroll-panel'].addEventListener('mousedown', () => this.onMousedownChanged(true));
    document.addEventListener('mouseup', () => this.onMousedownChanged(false));
    this.imgPreviewSrc = imgUrl;

    this.$nextTick(() => {
      if(imgUrl !== "") {
        this.onInputChanged(imageFile);
      }
    
      this.$refs['scroll-panel'].addEventListener('scroll', this.handleScroll);
      this.$refs['image'].addEventListener('load', this.onPreviewImageLoaded);

      this.initialized = true;
    });
  },
  beforeDestroy() {
    this.$refs['scroll-panel'].removeEventListener('scroll', this.handleScroll);
    this.$refs['image'].removeEventListener('load', this.onPreviewImageLoaded);
    this.$refs['scroll-panel'].removeEventListener('mousemove', this.onPreviewImageLoaded)
    document.removeEventListener('mouseup', this.onMousedownChanged);
  },
  methods: {
    onMousedownChanged(isMousedown){
      this.isMousedown = isMousedown;
    },
    onInputChanged(file) {
      if(file == null) return;

      const clipUri = URL.createObjectURL(file);

      this.imagePreviewBlob = file;
      this.imageFile = file;
      this.imgPreviewSrc = clipUri;

      this.imgSourceChanged(clipUri);
      this.fileName = (file && file.name) || '';

       //TODO: Fix This validation
       this.$store.dispatch('form/validateField', {field: this.fieldName, clipUri});
    },

    async onPreviewImageLoaded(ev) {
      const {scrollWidth, scrollHeight} = ev.target;

      this.$nextTick(() => {
        this.imageWidth = scrollWidth;
        this.imageHeight = scrollHeight;
        this.redrawCanvas();
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
    },

    onSpriteLoaded() {
      if(this.imagePreviewBlob.name == null) return;

      const ctx = this.$refs['otherCanvas'].getContext("2d");
      ctx.clearRect(0, 0, this.actualWidth, this.actualHeight);

      var ratio = this.actualWidth / this.actualHeight;
      var width = this.imageWidth;
      var height = width / ratio;

      ctx.drawImage(
        this.imageBlob, -1 * this.offsetX,
        (this.offsetY * 2) * -1,
        width,
        height
      );

      this.$nextTick(() => {
        this.$refs['otherCanvas'].toBlob( async blob => {
          const newFileName = `${this.imagePreviewBlob.name.substring(0, this.imagePreviewBlob.name.lastIndexOf('.'))}.png`;
          const imagePreviewBlob = new File([blob], newFileName, {type: 'image/png'});
          const clipUri = URL.createObjectURL(imagePreviewBlob);

          this.changeHandler({imagePreviewBlob, clipUri, imageBlob: this.imageBlob, imageFile: this.imageFile});
        });
      });
    },

    redrawCanvas() {
      if(this.initialized) {
        this.debounce(() => {
          Vue.set(this, 'imageBlob', new Image());
          this.imageBlob.onload = this.onSpriteLoaded;
          this.imageBlob.src = this.imgPreviewSrc;
        })
      }
    },

    handleScroll({target:{scrollLeft:offsetX, scrollTop:offsetY}}){
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.redrawCanvas();
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
        sprite.src = self.imgPreviewSrc;
      });
    },
  }
}
</script>
