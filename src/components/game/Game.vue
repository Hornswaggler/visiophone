<template>
<div style="height: 100vh;width: 100vw;display: flex;flex-direction: column;">
   <div class="css-selector">
    <Header/>
    <Navigation/>
  </div>
  <div ref="container" style="background-color:grey;height:100%;width:100%;display:flex;justify-content:center;align-items:center;">
    <div style="position:relative;">
      <div style="position:absolute;top:0;bottom:0;left:0;right:0;inset:unset;">
        <!-- <Player
          :x="xloc"
          :y="yloc"
        /> -->
         <img :src="require(`@/assets/Comp_boi_walkin.gif`)" style="  transition: transform 0.24s linear 0s;" :style="{transform : `translate(${xloc}px, ${yloc}px)`}"/>

      </div>
      <canvas ref="canvas" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
</div>
</template>
<script>
import Header from '@/components/layout/Header.vue'
import Navigation from '@/components/layout/Navigation.vue';

import {Map} from 'rot-js';

const IMAGE_SCALAR = 0.75;

export default {
  name: 'Game',
  components:{
    Header,
    Navigation,
    // Player
  },
  data:()=>({
    mapLimit: 5000,
    map: {},
    mapData:[],
    entities:[],
    height: 20,
    width: 20,
    tilesize: 40,
    color:'#FFFFFF',
    playerX:0,
    playerY:0,
  }),
  computed:{
    cubeKeys(){
      return Object.keys(this.cube);
    },
    xloc(){
      return this.playerX * this.tilesize;
    },
    yloc(){
      return this.playerY * this.tilesize;
    }
  },
  mounted(){
    let i = 0;
    window.requestAnimationFrame(()=>{console.log(++i);})

    window.addEventListener("keydown", this.onKey);

    this.resizeCanvas();
    window.addEventListener('resize', this.onResize);
    this.$nextTick(()=> {
      this.initMap();
      const spawn = this.getPlayerSpawn();
      this.playerX = spawn.x;
      this.playerY = spawn.y;
      console.log('Set Player');
      // this.entities.push(this.player);
      this.drawMap();
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keypress', this.onResize);
  },
  methods: {
    onKey({key}) {
      const handlers = {
        "ArrowUp": () => ({dy:-1}),
        "ArrowRight": () => ({dx:1}),
        "ArrowDown": () => ({dy:1}),
        "ArrowLeft": () => ({dx:-1}),
      };

      const template = { dx: 0, dy: 0 };
      const delta = handlers[key] ? { ...template, ...handlers[key]() } : template;

      const { dx, dy } = delta;
      const destination = { x: this.playerX + dx, y: this.playerY + dy};
      
      if(this.checkMapLocation(destination)){
        console.log('map location');
        this.playerX = destination.x;
        this.playerY = destination.y;

        this.drawMap();
        this.drawEntities();
      }
    },
    checkMapLocation({x, y}){
      try{
        return (x < 0 || y < 0)  || (x > this.width || y > this.height) ? 0 : this.mapData[x][y];
      }catch(e){
        return 0;
      }
    },
    clickMe(){
      this.showFront = !this.showFront;
    },
    onResize(){
      this.resizeCanvas();
      this.$nextTick(()=> {
        this.drawMap();
      });
    },
    resizeCanvas(){
      const newTileSize = Math.floor((this.$refs.container.clientHeight/this.height) - 5);
      this.tilesize = newTileSize;
    },

    initMap(){
      this.map = new Map.EllerMaze(this.width, this.height);
      this.mapData = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.mapData[x] = new Array(this.height);
      }
      const callback = (x, y, value) => {
        if(x === 0 || y === 0 || x === this.width -1 || y === this.height -1) {
          this.mapData[x][y] = 1;
          return;
        }
        this.mapData  [x][y] = value === 0 ? 1 : 0;
      };

      this.map.create(callback);
    },
    getPlayerSpawn(){
      let coords;
      for(let x = 0; x < this.mapData.length; x++){
        for(let y = 0; y < this.mapData[x].length; y++){
          if(this.mapData[x][y] === 1){
            coords = {x,y}
            break;
          }
        }
        if(coords) break;
      }

      return coords;
    },
    drawMap(){
        const context = this.$refs.canvas.getContext('2d');
        context.clearRect(0,0,this.width * this.tilesize, this.height * this.tilesize)
        for (let x = 0; x < this.width; x++) {
          for (let y = 0; y < this.height; y++) {
            if(this.mapData[x][y] === 1) this.drawTile(context, x,y);
          }
        }

        this.$nextTick(() => {
          this.drawEntities();
        })
    },
    drawEntities(){
      this.entities.forEach(entity => {
        console.log('drawing entities');
        //entity.draw({ width: this.tilesize, ctx: this.$refs.canvas.getContext('2d') });
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