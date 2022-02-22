<template>
  <img
    ref="frame"
    :src="path" 
    style="transition: transform 1.24s linear 0s;"
    :style="{transform: transform, height: `${tilesize}px`, width: `${tilesize}px`}"
  />
</template>
<script>
import { mapState, mapGetters } from 'vuex';

const defaultPath = 'Spikes.png';

export default {
  name: 'Entity',
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
    path(){
      try{
        return require(`@/assets/${this.entity.path ? this.entity.path : defaultPath}`);
      }
      catch(e){
        console.error(e);
        return defaultPath;
      }
    },
    transform() {
      return `translate(${this.entity.x * this.tilesize}px, ${this.entity.y * this.tilesize}px)`;
    }
  },
  methods:{
    setIdle(){
      this.$store.dispatch('game/stopEntity', this.id);
    }
  }
}
</script>
