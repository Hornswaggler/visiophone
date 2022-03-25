<template>
<div style="height: 100vh;width: 100vw;display: flex;flex-direction: column;">
   <div>
    <Header/>
    <Navigation/>
  </div>

  <!-- map container -->
  <div ref="container" class="flex" style="height:100%;align-items:center;position:relative;">

    <div style="height:100%;display:flex;margin-top:11em;margin-right:2em;justify-content:flex-end;">
      <div style="height:10em;width:5em;border: solid #65FE00 4px; border-radius:12px;display:flex;padding:1em;">
        <div>HP: {{playerOne.hp}}</div>
      </div>
    </div>

    <div style="flex:2">
      <div style="position:relative;"  >
        <Entity 
          style="position:absolute;flex:1"
          v-for='entity in entities' 
          :key="entity.id" 
          :id="entity.id"
        ></Entity>
        <canvas ref="canvas" :height="tilesize * height" :width="tilesize * width"></canvas>
      </div>
    </div>
  </div>

</div>
</template>
<script>
import {mapState} from 'vuex';
import Entity from '@/components/game/Entity';
import Header from '@/components/layout/Header.vue';
import Navigation from '@/components/layout/Navigation.vue';
import {ENTITY_TYPE} from '../../model/game/EntityConfig';
import HeartsModel from '../../model/game/HeartsModel';
import TileModel from '../../model/game/TileModel';
import PlayerModel from '../../model/game/PlayerModel';
import MonkeyModel from '../../model/game/MonkeyModel';
import SpikesModel from '../../model/game/SpikesModel';

const MAX_SPIKES = 11;

export default {
  name: 'Game',
  components:{
    Header,
    Navigation,
    Entity,
  },
  data:()=>({
    color:'#FFFFFF',
    initialized: false
  }),
  computed: {
    ...mapState('game',['mapData', 'height', 'width', 'tilesize', 'entities']),
  
    players() {
      return this.entities.filter(entity=>entity.type === ENTITY_TYPE.PLAYER)
    },
  
    spikes(){
      if(!this.initialized) return [];
      return this.entities.filter(entity=>entity.type === ENTITY_TYPE.SPIKES)
    },

    hearts(){
      if(!this.initialized) return [];
      return this.entities.filter(e=>e.type === ENTITY_TYPE.HEART);
    },

    tiles(){
      return this.entities.filter(e => e.type === ENTITY_TYPE.TILE);
    },

    playerOne(){
      return this.players.length < 1 ? {} : this.players[0];
    },
  
    container(){
      if(!this.$refs.container) return '';
      return this.$refs.container;
    }
  },
  async mounted(){
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    this.resizeCanvas();
    window.addEventListener('resize', this.onResize);

    this.$nextTick(async ()=> {
      await this.initMap();
     
      console.log('Was map initiated???');

      await (async () => {
        const {x, y} = await this.$store.dispatch('game/findFirstAvailable');
        return this.$store.dispatch('game/spawnEntity', {entity: PlayerModel({x, y})});
      })();

      for(let i = 0; i < MAX_SPIKES; i++){
        let {x, y} = await this.$store.dispatch('game/findRandomAvailable');
        await this.$store.dispatch('game/spawnEntity', {entity: MonkeyModel({x, y})});
      }

      for(let i = 0; i < MAX_SPIKES; i++){
        const {x, y} = await this.$store.dispatch('game/findRandomAvailable');
        await this.$store.dispatch('game/spawnEntity', {entity: SpikesModel({x, y})});
      }

      for(let i = 0; i < MAX_SPIKES; i++){
        const {x, y} = await this.$store.dispatch('game/findRandomAvailable');
        this.$store.dispatch('game/spawnEntity',{ entity: HeartsModel({ x, y })});

      }

      // TODO: No need for reduce
      const self = this;
      this.mapData.reduce((acc, x, i) => {
        try {
          x.map((entity, j) => {
            if(entity.tile) { 
              self.$store.dispatch('game/spawnEntity', { entity: TileModel({x: i, y: j, path: entity.path}) });
            }
            return { id: 2 };
          });
        } catch(e){
          console.error('error:', e);
          return acc;
        }
        return acc;
      },[]);

      this.initialized = true;
      this.resizeCanvas();
      
      console.log('Loaded, entities are:', this.entities);

    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keydown', this.onKeyUp);
  },
  methods: {
    onKeyDown({key}) {
      this.$store.dispatch('game/handleInputOn', {key});
    },

    onResize(){
      this.resizeCanvas();
    },

    resizeCanvas(){
      this.$store.dispatch('game/resizeMap', {clientHeight: this.$refs.container.clientHeight, clientWidth: this.$refs.container.clientWidth});
      this.drawMap();
    },

    initMap(){
      return this.$store.dispatch('game/initMap');
    },

    drawMap(){
      this.$nextTick(()=> {
        if(!this.initialized) return false;
        const context = this.$refs.canvas.getContext('2d');
        context.clearRect(0,0,this.width * this.tilesize, this.height * this.tilesize)
        for (let x = 0; x < this.width; x++) {
          for (let y = 0; y < this.height; y++) {
            this.drawTile(context, x,y, this.mapData[x][y]);
          }
        }
      });
    },

    drawTile(context, x, y, {path}) {
      const dx = x * this.tilesize;
      const dy = y * this.tilesize;
      const sprite = new Image();
      sprite.src = require(`@/assets/${path}`);
      sprite.addEventListener("load", () => {
        context.drawImage(sprite, dx, dy, this.tilesize, this.tilesize);
      });

    }
  }
}
</script>
<style lang="scss">
</style>