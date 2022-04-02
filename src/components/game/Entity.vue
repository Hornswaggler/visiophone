<template>
  <div
    style="transition: transform 1.24s linear 0s;position:absolute;"
    :style="{transform: transform, zIndex: `${entity.zIndex}`}"
  >
    <img
      ref="frame"
      :src="path"
      :aria="entity.type"
      :style=" {height: `${tilesize * scaleFactor}px`, width: `${tilesize * scaleFactor}px`,}"
    />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import {SCALE_FACTOR} from './Game.vue';

const defaultPath = 'Spikes.png';

export default {
  name: 'Entity',
  data: () => ({
    scaleFactor: SCALE_FACTOR,
  }),
  props:{
    id: String
  },
  mounted() {
    this.$refs.frame.addEventListener('transitionend', this.setIdle);
  },
  unmounted(){
    this.$refs.frame.removeEventListener('transitionend', this.setIdle);
  },
  computed:{
    ...mapState('game',['tilesize']),
    ...mapGetters('game',['getEntityById']),
    entity(){
      return this.getEntityById(this.id);
    },
    height() {
      return `${this.tilesize * this.scaleFactor}px`;
    },
    path(){
      try{
        return require(`@/assets/${this.entity.path ? this.entity.path : defaultPath}`);
      }
      catch(e){
        console.error(this, e);
        return defaultPath;
      }
    },
    transform() {
      try{
        return `translate(${this.entity.x * (this.tilesize * this.scaleFactor)}px, ${this.entity.y * (this.tilesize * this.scaleFactor)}px)`;
      }catch(e) {
        console.error(e);
        return `translate(${this.entity.x * this.tilesize}px, ${this.entity.y * this.tilesize}px)`
      }
    }
  },
  methods:{
    setIdle(){
      this.$store.dispatch('game/stopEntity', this.id);
    }
  }
}
</script>
