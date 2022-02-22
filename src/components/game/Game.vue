<template>
<div style="height: 100vh;width: 100vw;display: flex;flex-direction: column;">
   <div class="css-selector">
    <Header/>
    <Navigation/>
  </div>

  <!-- map container -->
  <div ref="container" class="flex" style="height:100%;align-items:center;position:relative;">
    <div style="flex:1;height:100%;display:flex;margin-top:11em;margin-right:2em;justify-content:flex-end;">
      <div style="height:10em;width:20em;border: solid #65FE00 4px; border-radius:12px;display:flex;padding:1em;">
        <div>HP: {{playerOne.hp}}</div>
      </div>
    </div>
    <div style="position:relative;">
      <Player style="position:absolute;flex:1" v-for='player in players' :key="player.id" :id="player.id"></Player>
      <Entity style="position:absolute;flex:1" v-for='spike in spikes' :key="spike.id" :id="spike.id"></Entity>

      <Entity style="position:absolute;flex:1" v-for='ent in ents' :key="ent.id" :id="ent.id"></Entity>

      <canvas ref="canvas" style="background-color:red;" :height="tilesize * height" :width="tilesize * width"></canvas>
    </div>
    <div style="flex:1;height:100%;"></div>
  </div>

</div>
</template>
<script>
import {mapState} from 'vuex';
import Player from '@/components/game/Player';
import Entity from '@/components/game/Entity';
import Header from '@/components/layout/Header.vue';
import Navigation from '@/components/layout/Navigation.vue';
import {ENTITY_TYPE} from '../../model/game/EntityConfig';
import HeartsModel from '../../model/game/HeartsModel';

const MAX_SPIKES = 11;

export default {
  name: 'Game',
  components:{
    Header,
    Navigation,
    Player,
    Entity
  },
  data:()=>({
    color:'#FFFFFF',
    initialized: false
  }),
  computed: {
    ...mapState('game',['mapData', 'height', 'width', 'tilesize', 'entities']),
    players() {
      if(!this.initialized) return [];
      return this.entities.filter(entity=>entity.type === ENTITY_TYPE.PLAYER)
    },
    spikes(){
      if(!this.initialized) return [];
      return this.entities.filter(entity=>entity.type === ENTITY_TYPE.SPIKES)
    },

    ents(){
      if(!this.initialized) return [];
      return this.entities.filter(e=>e.type === ENTITY_TYPE.HEART);
    },

    playerOne(){
      return this.players.length < 1 ? {} : this.players[0];
    },
    container(){
      if(!this.$refs.container) return '';
      return this.$refs.container;
    }
  },
  mounted(){
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    this.resizeCanvas();
    window.addEventListener('resize', this.onResize);
    this.$nextTick(async ()=> {
      await this.initMap();

      // todo refactor
      await this.$store.dispatch('game/spawnPlayer');

      for(let i = 0; i < MAX_SPIKES; i++)
        await this.$store.dispatch('game/spawnSpikes');

      for(let i = 0; i < MAX_SPIKES; i++)
        this.$store.dispatch('game/spawnEntity',{type: HeartsModel});

      this.initialized = true;
      this.resizeCanvas();
      
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keydown', this.onKeyUp);
  },
  methods: {
    // TODO refactor
    onKeyDown({key}) {
      this.$store.dispatch('game/handleInputOn', {key});
    },

    onResize(){
      this.resizeCanvas();
    },
    resizeCanvas(){
      this.$store.dispatch('game/resizeMap', {clientHeight: this.$refs.container.clientHeight});
      this.drawMap();
    },

    initMap(){
      this.$store.dispatch('game/initMap');
    },

    drawMap(){
      this.$nextTick(()=> {
        if(!this.initialized) return false;
        const context = this.$refs.canvas.getContext('2d');
        context.clearRect(0,0,this.width * this.tilesize, this.height * this.tilesize)
        for (let x = 0; x < this.width; x++) {
          for (let y = 0; y < this.height; y++) {
            if(this.mapData[x][y] === 1) this.drawTile(context, x,y);
          }
        }
      });
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