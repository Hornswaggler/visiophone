<template>
  <div class="audio-player">
    <audio
      :src="nowPlaying.clipUri"
      ref="audioPlayer"
      style="display:none;"
      controls 
    ></audio>
    <render-svg
      :rawSVG="arrowLeftSvg"
      :elementClasses="['navigation-button']"
      :on-click="onPrevClicked"
    ></render-svg>
    <div 
      @click="onPlayClicked"
      class="position-relative flex align-center justify-center"
    >
      <render-svg
        :rawSVG="playButtonSvg"
        :elementClasses="['play-button']"
        style="z-index: 1"
      ></render-svg>
      <div 
        class="cover pause-button flex justify-center align-center" 
      >
        <font-awesome-icon
          :class="{'show-pause-button': true}"
          :style="{opacity: showPauseButton ? 1 : 0}"
          icon="fa-pause" 
        />
      </div>
    </div>
    <render-svg
      :rawSVG="arrowRightSvg"
      :elementClasses="['navigation-button']"
      :on-click="onNextClicked"
    ></render-svg>      
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import RenderSvg from '@/components/common/RenderSvg.vue';
import playButtonSvg from '@/assets/PlayButton.svg?raw';
import arrowLeftSvg from '@/assets/Arrow_left.svg?raw';
import arrowRightSvg from '@/assets/Arrow_Right.svg?raw';

const AUDIO_PLAYER_STATE = {
  PLAY: 'PLAY', 
  INIT: 'INIT', 
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
  READY: 'READY'
};

export default {
  name: 'AudioPlayer',
  components: {
    RenderSvg
  },
  props:{
    volume:{
      type: Number,
      default: 100
    }
  },
  watch:{
    volume(newVolume){
      this.setVolume(newVolume)
    }
  },
  data: () => ({
    playButtonSvg,
    arrowLeftSvg,
    arrowRightSvg,
    canPlayThrough: false,
    state: AUDIO_PLAYER_STATE.INIT,
  }),
  computed:{
    ...mapState('audioPlayer', ['playWhenReady']),
    ...mapGetters('audioPlayer', ['nowPlaying']),
    showPauseButton() {
      return this.state === AUDIO_PLAYER_STATE.PLAY;
    }
  },
  mounted(){
    this.$refs.audioPlayer.addEventListener('canplaythrough',this.onCanPlayThrough);
    this.$refs.audioPlayer.addEventListener('playing',this.onIsPlaying);
    this.$refs.audioPlayer.addEventListener('pause', this.onPause);
    this.$refs.audioPlayer.addEventListener('timeupdate', this.onTimeUpdate);
  },
  beforeDestroy(){
    this.$refs.audioPlayer.removeEventListener('transitionend', this.onCanPlayThrough);
    this.$refs.audioPlayer.removeEventListener('playing', this.onIsPlaying);
    this.$refs.audioPlayer.removeEventListener('pause', this.onPause);
    this.$refs.audioPlayer.removeEventListener('timeupdate', this.onTimeUpdate);
  },
  methods:{
    onCanPlayThrough() {
      if(this.playWhenReady){
        this.play();
      }
      this.state = AUDIO_PLAYER_STATE.READY;
    },
    play(){
      this.$refs.audioPlayer.play();
    },
    setVolume(volume){
      this.$refs.audioPlayer.volume = volume * 0.01;
    },
    onPause(){
      this.state = AUDIO_PLAYER_STATE.PAUSED;
    },
    pause(){
      this.$refs.audioPlayer.pause();
    },
    onIsPlaying(){
      this.state = AUDIO_PLAYER_STATE.PLAY;
    },
    onNextClicked(){
      this.$store.dispatch('audioPlayer/playNext');
    },
    onPrevClicked(){
      this.$store.dispatch('audioPlayer/playPrev');
    },
    onTimeUpdate(event){
      this.time = event.srcElement.currentTime;
    },
    onPlayClicked(){
      switch(this.state) {
        case AUDIO_PLAYER_STATE.PAUSED:
        case AUDIO_PLAYER_STATE.READY:
          this.play();
          break;
        case AUDIO_PLAYER_STATE.PLAY:
          this.pause();
          break;
      }
    },
  }
}
</script>

<style>

</style>