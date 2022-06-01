<template>
<div style="height: 100vh;width: 100vw;display: flex;flex-direction: column;">
   <div>
    <Header/>
    <Navigation/>
    off:{{offSetX}}, {{offSetY}} &nbsp;clientHeight: {{clientHeight}} clientWidth: {{clientWidth}} P1pos {{playerOnePosition}} camera offset {{cameraOffsetX}}, {{cameraOffsetY}}
  </div>

  <div  class="flex" style="height:100%;align-items:center;position:relative;">

    <div style="height:100%;display:flex;margin-top:11em;margin-right:2em;justify-content:flex-end;">
      <div style="height:10em;width:8em;border: solid #65FE00 4px; border-radius:12px;display:flex;padding:1em;">
        <div>HP: {{playerOne.hp}}</div>
      </div>
    </div>

    <div style="flex:1;height:100%;display:flex;">
        <!-- Map -->
        <div ref="container" style="position:relative;flex:1;">
          <canvas ref="canvas" style="position:absolute;display:flex;" :height="`${tilesize * yVisible * scaleFactor}px`" :width="`${tilesize * xVisible * scaleFactor}px`"></canvas>

            <div style="position:absolute;display:flex;" :style="{height: `${tilesize * yVisible * scaleFactor}px`, width: `${tilesize * xVisible * scaleFactor}px`}">
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
import {KEYS} from '../../model/game/PlayerConfig.js';
import HeartsModel from '../../model/game/HeartsModel';
import PlayerModel from '../../model/game/PlayerModel';
import MonkeyModel from '../../model/game/MonkeyModel';
import SpikesModel from '../../model/game/SpikesModel';

const MAX_SPIKES = 10;

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
    lastTimestamp:0,
    x:0,
    y:0,
    tileSet:[],
    isPlayerMoving: false,
    cameraOffsetX: 0,
    cameraOffsetY: 0,
  }),
  computed: {
    ...mapState('game',['mapData', 'height', 'width', 'tilesize', 'entities', 'clientWidth', 'clientHeight', 'offSetX', 'offSetY', 'scaleFactor']),
  
    xVisible(){
      const screen = this.clientWidth / (this.tilesize * this.scaleFactor);
      return Math.ceil(screen > this.width ? this.width : screen);
    },

    yVisible(){
      const screen = this.clientHeight / (this.tilesize * this.scaleFactor);
      return Math.ceil(screen > this.height ? this.height : screen);
    },

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

    playerOnePosition(){
      const {x, y} = this.playerOne;
      return {x, y};
    },
  
    container(){
      if(!this.$refs.container) return '';
      return this.$refs.container;
    }
  },

  async mounted(){
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    // this.resizeCanvas();
    window.addEventListener('resize', this.onResize);

    await this.initMap();
    
    await (async () => {
      const {x, y} = await this.$store.dispatch('game/findFirstAvailable');
      return this.$store.dispatch('game/spawnEntity', {entity: PlayerModel({x, y})});
    })();

    // await (async () => {
    //   let {x, y} = await this.$store.dispatch('game/findRandomAvailable');
    //   await this.$store.dispatch('game/spawnEntity', {entity: MonkeyModel({x, y})});
    // })();

    for(let i = 0; i < MAX_SPIKES; i++){
      const {x, y} = await this.$store.dispatch('game/findRandomAvailable');
      await this.$store.dispatch('game/spawnEntity', {entity: SpikesModel({x, y})});
    }

    for(let i = 0; i < MAX_SPIKES; i++){
      const {x, y} = await this.$store.dispatch('game/findRandomAvailable');
      await this.$store.dispatch('game/spawnEntity',{ entity: HeartsModel({ x, y })});
    }

    await this.loadTileset();

    this.initialized = true;

    setTimeout(() => this.resizeCanvas(), 1);
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keydown', this.onKeyUp);
  },
  watch:{
    playerOnePosition({x,y}, {x: oldX, y: oldY} = {x: 0, y: 0}){
      const scalarX = oldX - x;
      const scalarY = oldY - y;

      const playerScreenPositionX = (x * this.tilesize * this.scaleFactor) - this.offSetX;
      const playerScreenPositionY = (y * this.tilesize * this.scaleFactor) + this.offSetY;

      if((scalarX < 0 && playerScreenPositionX > this.clientWidth/2)) {
        const prevOffset = this.cameraOffsetX;
        this.cameraOffsetX += (this.tilesize * this.scaleFactor * scalarX);
      }

      if(scalarX > 0 && playerScreenPositionX >= this.clientWidth/2 && this.cameraOffsetX != 0){
        const prevOffset = this.cameraOffsetX;
        this.cameraOffsetX += (this.tilesize * this.scaleFactor * scalarX)
      }

      if(scalarY < 0 
          && (this.playerOnePosition.y * this.tilesize * this.scaleFactor) + this.offSetY > this.clientHeight/2 
          && this.cameraOffsetY != this.height * this.tilesize * this.scaleFactor){
        this.cameraOffsetY += (this.tilesize * this.scaleFactor * scalarY);
      }

      if(scalarY > 0 && (this.playerOnePosition.y * this.tilesize * this.scaleFactor) + this.offSetY <= this.clientHeight/2 && this.cameraOffsetY != 0){
        this.cameraOffsetY += (this.tilesize * this.scaleFactor * scalarY);
      }
    },

    cameraOffsetY(_y, _oldY) {
      this.scrollCameraY({_dx:0, _dy: _y - _oldY});
    },

    cameraOffsetX(_x, _oldX) {
      this.scrollCameraX({_dx: _x - _oldX, _dy: 0});
    }
  },
  methods: {
    scrollCameraX({_dx, _dy}) {
      console.log('ASDF');
      return new Promise((resolve, reject) => {
        try {
          let dx = _dx;

          const ix = dx > 0 ? 1 : (dx < 0 ? -1 : 0);

          const recurse = async timeStamp => {
            let _dx = Math.abs(dx) > 0  ? await this.$store.dispatch('game/updateOffsetX', this.offSetX + ix) : 0;

            if(Math.abs(_dx) > 0){
              await this.drawMap({dx: _dx, dy: this.offSetY});
              dx = dx - ix;

              return window.requestAnimationFrame(recurse);
            }
            
            return resolve();
          }
          recurse();
        } catch(e) {
          console.error(e);
          throw e;
        }
      })
    },
    scrollCameraY({_dx, _dy}) {
      console.log('ASDF');
      return new Promise((resolve, reject) => {
        try {
          // let dx = _dx;
          let dy = _dy;

          // const ix = dx > 0 ? 1 : (dx < 0 ? -1 : 0);
          const iy = dy > 0 ? 1 : (dy < 0 ? -1 : 0);

          const recurse = async timeStamp => {
            // let _dx = Math.abs(dx) > 0  ? await this.$store.dispatch('game/updateOffsetX', this.offSetX + ix) : 0;
            let _dy = Math.abs(dy) > 0 ? await this.$store.dispatch('game/updateOffsetY', this.offSetY + iy) : 0;

            if(Math.abs(_dy) > 0){
              await this.drawMap({dx: this.offSetX, dy: _dy});
              dy = dy - iy;
              // dx = dx - ix;

              return window.requestAnimationFrame(recurse);
            }
            
            return resolve();
          }
          recurse();
        } catch(e) {
          console.error(e);
          throw e;
        }
      })
    },
    async onKeyDown(e) {
      if(Object.values(KEYS).includes(e.key) && !this.isPlayerMoving && !e.repeat){
        e.stopPropagation();
        e.preventDefault();

        await this.$store.dispatch('game/handleInputOn', {key:e.key});
      } 
      
    },

    onResize(){
      this.resizeCanvas();
    },

    async resizeCanvas(){
      await this.$store.dispatch('game/resizeMap', {clientHeight: this.$refs.container.clientHeight, clientWidth: this.$refs.container.clientWidth});
      await this.drawMap();
    },

    initMap(){
      return this.$store.dispatch('game/initMap');
    },

    async drawMap({dx, dy} = {dx: 0, dy: 0}){
      if(!this.initialized) return false;
      const context = this.$refs.canvas.getContext('2d');

      context.save();
      context.clearRect(0,0,this.width * this.tilesize, this.height * this.tilesize);
      context.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, dx, dy);

      const lastIndexX = (this.width * this.tilesize);
      const targetStartX =  Math.floor(0 - (this.offSetX/(this.tilesize * this.scaleFactor)));
      const xStart = targetStartX < 0 ? 0 : targetStartX;
      const targetEndX = (xStart + this.xVisible);
      const xEnd = (targetEndX >= lastIndexX ? lastIndexX: targetEndX) + 1;

      const lastIndexY = (this.height * this.tilesize) - 1;
      const targetStartY =  Math.floor(0 - (this.offSetY/(this.tilesize * this.scaleFactor)));
      const yStart = targetStartY < 0 ? 0 : targetStartY;
      const targetEndY = (yStart + this.yVisible);
      const yEnd = (targetEndY >= lastIndexY ? lastIndexY: targetEndY) + 1;

      console.log(xStart, xEnd, yStart, yEnd, dx, dy);

      for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
          if(!this.mapData[x] || !this.mapData[x][y]){
            console.error('NO MAP DATA!', this.mapData, x, y);
          }
          await this.drawTile(context, x, y, this.mapData[x][y]);
        }
      }

      context.beginPath();
      context.rect((this.width * this.tilesize) - 1, 0, (this.width * this.tilesize) +  (this.width * this.tilesize), this.height * this.tilesize);
      context.fillStyle = "black";
      context.fill();

      context.beginPath();
      context.rect(0, this.height * this.tilesize, (this.width * this.tilesize) +  (this.width * this.tilesize), this.height * this.tilesize);
      context.fillStyle = "black";
      context.fill();

      context.translate(dx, 0);
      context.restore();
    },

    async loadTileset(){
      const result = await this.mapData
      .reduce((acc, x, i) => {
        x.map(tile =>{
          if(!acc.includes(tile.path))acc.push(tile.path);
        })
        return acc;
      },[])
      .map(async (path) =>{
        const sprite = new Image();
        sprite.src = require(`@/assets/${path}`);
        this.tileSet.push({sprite: await this.loadTile({sprite}), path});
      });
      console.log('Tileset', this.mapData);
    },
    
    loadTile({sprite}){
      return new Promise((resolve, reject) => {
        sprite.addEventListener("load", () => {
          return resolve(sprite);
        });
      });
    },

    drawTile(context, x, y, {path}) {
      if(!path)console.error('NO PATH!');
      const dx = x * this.tilesize;
      const dy = y * this.tilesize;
      const tile = this.tileSet.find(tile=> {
        return tile.path === path;
      });

      if(!tile) return false;

      if(dx >= 0 && dx + this.offSetX <= this.clientWidth - (this.tilesize * 2)) 
        context.drawImage(tile.sprite, dx, dy, this.tilesize, this.tilesize);
    }
  }
}
</script>
<style lang="scss">
</style>