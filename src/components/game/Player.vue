<template>
<div>
  <img 
    :src="require(`@/assets/Comp_boi_walkin.gif`)" 
    style="transition: transform 0.24s linear 0s;"
    :style="{transform: transform}"
  />
</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Player',
  props:{
    id: String
  },
  mounted(){
    console.log('Player Loaded');
  },
  computed:{
    ...mapState('game',['tilesize']),
    ...mapGetters('game',['getEntityById']),
    player(){
      return this.getEntityById(this.id);
    },
    x(){
      return this.player.x;
    },
    y(){
      return this.player.y;
    },
    transform() {
      return `translate(${this.x * this.tilesize}px, ${this.y * this.tilesize}px)`;
    }
  }
}
</script>
