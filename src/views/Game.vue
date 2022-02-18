<template>
<div style="height:100vh;width:100vw;display:flex;justify-content:center;align-items:center;">
  <img ref='image' style='display:none;' src='@/assets/Comp_boi_idle.gif'/>
  <canvas ref="canvas" :height="tilesize*height" :width="tilesize*width"></canvas>
</div>
</template>
<script>
import {Map} from 'rot-js';

class Player {
  constructor({x,y, width, ctx}){
    console.log('const');
    this.x = x;
    this.y = y;
    this.width = width;
    this.image = new Image(width, width);
    this.image.src = require(`@/assets/Comp_boi_idle.gif`);
    this.image.addEventListener('load', () => {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.width);
    });
  }

  draw(context) {
    // context.fillStyle = this.attributes.color || 'white';
    // context.textBaseline = 'hanging';
    // context.font = '16px Helvetica';
    console.log('Drawing');
    try{
      context.drawImage(this.image, this.x, this.y, this.width, this.width);
    }catch(e){
      console.error(e);
    }
  }
}

export default {
  name: 'Game',
  data:()=>({
    mapLimit: 5000,
    map: {},
    mapData:[],
    entities:[],
    height: 20,
    width: 20,
    tilesize: 16,
    color:'#66FF00',
    player: {}
  }),
  computed:{
    cubeKeys(){
      return Object.keys(this.cube);
    }
  },
  mounted(){
    this.initMap();
    this.player = new Player({...this.getPlayerSpawn(), width: this.tilesize, ctx: this.$refs.canvas.getContext('2d')});
    this.entities.push(this.player);
    this.drawMap();
  },
  methods:{
    clickMe(){
      this.showFront = !this.showFront;
    },
    initMap(){
      this.map = new Map.EllerMaze(this.width, this.height);
      this.mapData = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.mapData[x] = new Array(this.height);
      }
      const callback = (x, y, value) => {
        if(x === 0 || y === 0 || x === this.width -1 || y === this.height -1) {
            this.mapData[x][y] = 1; //create walls around edges of map
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
          if(this.mapData[x][y] === 0){
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
            if(this.mapData[x][y] === 1) this.drawWall(context, x,y);
          }                
        }
      
      this.entities.forEach(entity => {
          entity.draw(context, this.$refs.image);
      });
    },
    drawWall(context, x, y) {
      context.fillStyle = this.color;
      context.fillRect(x  * this.tilesize, y * this.tilesize, this.tilesize, this.tilesize);
    }
  }
}
</script>
<style lang="scss">
</style>