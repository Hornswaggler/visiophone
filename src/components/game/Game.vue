<template>
<div style="height: 100vh;width: 100vw;display: flex;flex-direction: column;">
   <div>
    <Header/>
    <Navigation/>
  </div>

  <div  class="flex" style="height:100%;align-items:center;position:relative;">

    <div style="height:100%;display:flex;margin-top:11em;margin-right:2em;justify-content:flex-end;">
      <div style="height:10em;width:8em;border: solid #65FE00 4px; border-radius:12px;display:flex;padding:1em;">
        <div>HP: {{playerOne.hp}}</div>
      </div>
    </div>

    <div style="flex:2;height:100%;display:flex;">
        <div ref="container" style="position:relative;flex:1;">
          <canvas ref="canvas" style="position:absolute;display:flex;" :height="`${tilesize * height * scaleFactor}px`" :width="`${tilesize * width * scaleFactor}px`"></canvas>

            <div style="position:absolute;display:flex;" :style="{height: `${tilesize * height * scaleFactor}px`, width: `${tilesize * width * scaleFactor}px`}">
              <div style="flex:1; position:relative;display:flex;">
                <Entity
                  v-for='entity in entities' 
                  :key="entity.id"
                  :id="entity.id"
                ></Entity>
              </div>
            </div>
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

const MAX_SPIKES = 10;
export const SCALE_FACTOR = 4;

export default {
  name: 'Game',
  components:{
    Header,
    Navigation,
    Entity,
  },
  data:()=>({
    color:'#FFFFFF',
    initialized: false,
    scaleFactor: SCALE_FACTOR
  }),
  computed: {
    ...mapState('game',['mapData', 'height', 'width', 'tilesize', 'entities', 'clientWidth', 'clientHeight']),
  
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

    let x = 0;
    let y = 0;

    const animationLoop = timeStamp => {
      const context = this.$refs.canvas.getContext('2d');
      x+=1;
      y+=1;
      context.setTransform(SCALE_FACTOR,0,0,SCALE_FACTOR,x,y);

      window.requestAnimationFrame(animationLoop);

    }


    this.resizeCanvas();
    window.addEventListener('resize', this.onResize);

    this.$nextTick(async ()=> {
      await this.initMap();
     
      await (async () => {
        const {x, y} = await this.$store.dispatch('game/findFirstAvailable');
        return this.$store.dispatch('game/spawnEntity', {entity: PlayerModel({x, y})});
      })();

      let {x, y} = await this.$store.dispatch('game/findRandomAvailable');
      await this.$store.dispatch('game/spawnEntity', {entity: MonkeyModel({x, y})});


      for(let i = 0; i < MAX_SPIKES; i++){
        const {x, y} = await this.$store.dispatch('game/findRandomAvailable');
        await this.$store.dispatch('game/spawnEntity', {entity: SpikesModel({x, y})});
      }

      for(let i = 0; i < MAX_SPIKES; i++){
        const {x, y} = await this.$store.dispatch('game/findRandomAvailable');
        this.$store.dispatch('game/spawnEntity',{ entity: HeartsModel({ x, y })});

      }

      const self = this;
      this.mapData.map((x, i) => {
        try {
          x.map((entity, j) => {
            if(entity.tile) { 
              self.$store.dispatch('game/spawnEntity', { entity: TileModel({x: i, y: j, path: entity.path}) });
            }
          });
        } catch(e){
          console.error('error:', e);
        }
      });

      this.initialized = true;
      this.resizeCanvas();
      
      const fps = 30;
      const SCROLL_SPEED = 1.0; //bps
      let offset = {
        x:0.0,
        y:0.0
      };
      let ticks = 0;
      // animationLoop();

      // setInterval(() =>{
      //   ticks++;
      //   if(ticks%fps === 0)
      //   const { x, y } = offset;
      //   offset = {...offset, }
      // }, 1000/fps)

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

    redrawMap(){

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
        context.setTransform(SCALE_FACTOR,0,0,SCALE_FACTOR,0,0);
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