<template>
  <div class="page-footer-container pl1 noselect pr1">
    <audio-player
      :volume="volume"
    ></audio-player>
    <div class="details flex">
      <form-image
        :url="`${nowPlaying.imgUrl}`"
      />
      <div class="name">{{ nowPlaying.name }}</div>
    </div>
    <volume-control
      :on-changed="onVolumeChanged"
    ></volume-control>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import AudioPlayer from '@/components/common/AudioPlayer.vue';
import VolumeControl from '@/components/common/VolumeControl.vue';
import FormIcon from '../form/FormIcon.vue';
import RenderSvg from '@/components/common/RenderSvg.vue';
import FormImage from '@/components/form/FormImage.vue';

export default {
  name:'PageFooter',
  components: {
    AudioPlayer,
    FormIcon,
    RenderSvg,
    FormImage,
    VolumeControl
  },
  props:{
    menuItems:{
      type: Array,
      default: () => {}
    }
  },
  data:() => ({
    volume: 100,
  }),
  computed:{
    ...mapGetters('audioPlayer', ['nowPlaying']),
  },
  methods:{
    onVolumeChanged(volume){
      this.volume = volume;
    }
  }
}
</script>
