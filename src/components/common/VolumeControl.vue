<template>
  <div class="volume-controls flex align-center justify-end">
    {{ percentComplete }}
    <div
      ref="volumeControls"
      class="volume-controls-container"
      :class="{grabbing: isMouseDown}"
    >
      <div
        ref="volumeKnob"
        class="volume-slider-knob"
        :style="{
          left: `${offsetX}px`,
          'z-index': isMouseDown ? -1 : 1
        }"
      ></div>
      <div class="volume-slider-bar">
        <div class="progress" :style="{width: `${percentComplete}%`}">&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'vue-debounce';
import { mapGetters } from 'vuex';

export default {
  name: 'VolumeControl',
  props:{
    onChanged:{
      type: Function,
      default: () => {}
    },
  },
  data: () => ({
    debounce: debounce((callback, val) => callback && callback(val), 5),
    time: 0,
    isMouseDown: false,
    offsetX: 0,
    clickOffset: 0,
    percentComplete: 100
  }),
  computed:{
    ...mapGetters('audioPlayer', ['nowPlaying']),
  },
  async mounted(){
    this.$refs.volumeControls.addEventListener('mousemove', this.onMouseMove);
    this.$refs.volumeKnob.addEventListener('mousedown', this.onMouseDown);
    this.$refs.volumeControls.addEventListener('mouseup', this.onMouseUp);
    this.$refs.volumeControls.addEventListener('mouseleave', this.onMouseLeave);

    this.offsetX = this.$refs.volumeControls.clientWidth - this.$refs.volumeKnob.clientWidth 
    this.percentComplete = 100;
  },
  beforeDestroy(){
    this.$refs.volumeControls.removeEventListener('mousemove', this.onMouseMove);
    this.$refs.volumeKnob.removeEventListener('mousedown', this.onMouseDown);
    this.$refs.volumeControls.removeEventListener('mouseup', this.onMouseUp);
    this.$refs.volumeControls.removeEventListener('mouseleave', this.onMouseLeave)

  },
  methods:{
    onMouseUp() {
      this.isMouseDown = false;
    },
    onMouseDown(event){
      this.isMouseDown = true;
      this.clickOffset = event.offsetX;
    },
    onMouseLeave(){
      this.isMouseDown = false;
    },
    onMouseMove(event){
      if(this.isMouseDown && event.target === this.$refs.volumeControls) {
        this.debounce(() => {
          this.percentComplete = Math.round((event.offsetX / this.$refs.volumeControls.clientWidth) * 100);
          this.offsetX = event.offsetX - this.clickOffset;
          this.onChanged(this.percentComplete)
        });
      }
    },
  }
}
</script>

<style>

</style>