<template>
<div style="height: 100vh;width: 100vw;display: flex;flex-direction: column;">
   <div class="css-selector">
    players: {{players}}

    <Header/>
    <Navigation/>
  </div>
  <div ref="container" class="fill flex justify-center align-center" style="background-color:grey;">
    <div style="position:relative;">
      <div style="position:absolute;top:0;bottom:0;left:0;right:0;inset:unset;">
        <div v-for='player in players' :key="player.id" >
          <Player :id="player.id"></Player>
        </div>
      </div>
      <canvas ref="canvas" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
</div>
</template>
<script>
import {mapState} from 'vuex';
import Player from '@/components/game/Player';
import Header from '@/components/layout/Header.vue'
import Navigation from '@/components/layout/Navigation.vue';
import {ENTITY_TYPE} from '@/store/modules/game';

console.log('ENTITY:', ENTITY_TYPE);

const IMAGE_SCALAR = 0.75;

export default {
  name: 'Game',
  components:{
    Header,
    Navigation,
    Player
  },
  data:()=>({
    color:'#FFFFFF',
    initialized: false
  }),
  computed:{
    ...mapState('game',['mapData', 'height', 'width', 'tilesize', 'entities']),
    players(){
      if(!this.initialized) return [];
      return this.entities.filter(entity=>entity.type === ENTITY_TYPE.PLAYER)
    }
  },
  mounted(){
    window.addEventListener("keydown", this.onKey);
    this.resizeCanvas();
    window.addEventListener('resize', this.onResize);
    this.$nextTick(async ()=> {
      await this.initMap();
      await this.$store.dispatch('game/spawnPlayer');
      this.initialized = true;
      this.drawMap();
      
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keypress', this.onResize);
  },
  methods: {
    // TODO refactor
    onKey({key}) {
      this.$store.dispatch('game/handleInput', {key});
    },

    onResize(){
      this.resizeCanvas();
      this.$nextTick(()=> {
        this.drawMap();
      });
    },
    resizeCanvas(){
      this.$store.dispatch('game/resizeMap', this.$refs.container.clientHeight);
    },

    initMap(){
      this.$store.dispatch('game/initMap');
    },

    drawMap(){
      if(!this.initialized) return false;
      console.log('Drawing', this.initialized);
      const context = this.$refs.canvas.getContext('2d');
      context.clearRect(0,0,this.width * this.tilesize, this.height * this.tilesize)
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if(this.mapData[x][y] === 1) this.drawTile(context, x,y);
        }
      }
    },
    drawTile(context, x, y) {
      context.fillStyle = this.color;
      context.fillRect(x  * this.tilesize, y * this.tilesize, this.tilesize, this.tilesize);
    }
  }
}
</script>
<style lang="scss">
</style>