<template>
  <div>
    <img
      ref="image"
      :src="path" 
      style="transition: transform 1.24s linear 0s;"
      :style="{transform: transform, height: `${tilesize}px`, width: `${tilesize}px`}"
  />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

const defaultPath = 'Comp_boi_idle.gif';

export default {
  name: 'Player',
  props:{
    id: String
  },
  mounted() {
    this.$refs.image.addEventListener('transitionend', this.setIdle);
  },
  unmounted(){
    this.$refs.image.removeEventListener('transitionend', this.setIdle);
  },
  computed:{
    ...mapState('game',['tilesize']),
    ...mapGetters('game',['getEntityById']),
    player(){
      return this.getEntityById(this.id);
    },
    path(){
      try{
        return require(`@/assets/${this.player.path ? this.player.path : defaultPath}`);
      }
      catch(e){
        return defaultPath;
      }
    },
    transform() {
      return `translate(${this.player.x * this.tilesize}px, ${this.player.y * this.tilesize}px)`;
    }
  },
  methods:{
    setIdle(){
      this.$store.dispatch('game/stopEntity', this.id);
    }
  }
}
</script>
