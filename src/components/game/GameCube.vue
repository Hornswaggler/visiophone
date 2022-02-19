<template>
<div @click="clickMe" style="height:100vh;width:100vw;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;">
  <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>  <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>

    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
    <div class="scene fancy">
    <div class="cube fancy-cube">
      <canvas v-for="(cubeKey, i) in cubeKeys" class="cube__face" :class="cube[cubeKey].class" :key="cubeKey" :ref="`canvas${i}`" :height="tilesize*height" :width="tilesize*width"></canvas>
    </div>
  </div>
</div>
</template>
<script>
import {Map} from 'rot-js';

export default {
  name: 'Game',
  data:()=>({
    showFront: true,
    mapLimit: 5000,
    maps: {},
    mapData:{},
    height: 20,
    width: 20,
    tilesize: 16,
    color:'#66FF00',
    cube:{
      front:{class:{'cube__face--front':true, 'cube.show-front':true,}},
      right:{class:{'cube__face--right':true, 'cube.show-right':true}},
      back:{class:{'cube__face--back':true, 'cube.show-back':true}},
      left:{class:{'cube__face--left':true, 'cube.show-left':true}},
      top:{class:{'cube__face--top':true, 'cube.show-top':true}},
      bottom:{class:{'cube__face--bottom':true, 'cube.show-bottom':true}}
    }
  }),
  computed:{
    cubeKeys(){
      return Object.keys(this.cube);
    }
  },
  mounted(){
    this.initMap();
    this.drawMap();
  },
  methods:{
    clickMe(){
      this.showFront = !this.showFront;
    },
    initMap(){
      
      // const refCount = Object.keys(this.$refs).length;
      // this.mapData = {};
      // new Array(refCount);

      const self = this;
      Object.keys(this.$refs).map(key=>{
        console.log(key);
        self.$set(self.maps, key, new Map.EllerMaze(this.width, this.height));
        self.$set(self.mapData, key, new Array(this.width));
        for (let x = 0; x < this.width; x++) {
          this.mapData[key][x] = new Array(this.height);
        }
        const callback = (x, y, value) => {
        // console.log(x,y,value);
          if(x === 0 || y === 0 || x === self.width -1 || y === self.height -1) {
              self.mapData[key][x][y] = 1; //create walls around edges of map
              return;
          }
          self.mapData[key][x][y] = value === 0 ? 1 : 0;
        };

        this.maps[key].create(callback);
      });





      // this.map.randomize(0.5);
      // const self = this;
      // const callback = (x, y, value) => {
      //     // console.log(x,y,value);
      //      if(x === 0 || y === 0 || x === self.width -1 || y === self.height -1) {
      //          self.mapData[x][y] = 1; //create walls around edges of map
      //          return;
      //      }
      //      self.mapData[x][y] = value === 0 ? 1 : 0;
      // };

      // this.map.create(callback);
      // this.map.connect(callback, 1);
    },
    drawMap(){
      console.log('About to draw map');
      // const context = this.$refs.canvas.getContext('2d');

      const self = this;
      Object.keys(this.$refs).map(key=>{
        const context = self.$refs[key][0].getContext('2d');
        context.clearRect(0,0,this.width * this.tilesize, this.height * this.tilesize)
        for (let x = 0; x < this.width; x++) {
          for (let y = 0; y < this.height; y++) {
            if(this.mapData[key][x][y] === 1) this.drawWall(context, x,y);
          }                
        }
      })

      // context.clearRect(0,0,this.width * this.tilesize, this.height * this.tilesize)
      // for (let x = 0; x < this.width; x++) {
      //   for (let y = 0; y < this.height; y++) {
      //     if(this.mapData[x][y] === 1) this.drawWall(context, x,y);
      //   }                
      // }

      // this.entities.forEach(entity => {
      //     entity.draw(context);
      // });
    },
    nextColor(){
      this.color = this.color === '#66FF00'  ? '#FFA500' : '#66FF00';
      console.log();
      return this.color;
    },
    drawWall(context, x, y) {
      context.fillStyle = this.nextColor();
      context.fillRect(x  * this.tilesize, y * this.tilesize, this.tilesize, this.tilesize);
    }
  }
}
</script>
<style lang="scss">
* { box-sizing: border-box; }

.fancy-cube{
  animation: rotate-cube 30s linear infinite;
}


@keyframes rotate-cube {
  0% {
    transform: translateZ(-100px) rotateY(   0deg);
  }

  16% {
    transform: translateZ(-100px) rotateY( -90deg);
  }

  32%{
    transform: translateZ(-100px) rotateY(-180deg); 
  }

  48%{
    transform: translateZ(-100px) rotateY(  90deg);
  }

  64%{
    transform: translateZ(-100px) rotateX( -90deg);
  }

  80%{
    transform: translateZ(-100px) rotateX(  90deg);
  }
}




.cube.show-front  {  }
.cube.show-right  {  }
.cube.show-back   { }
.cube.show-left   {  }
.cube.show-top    {  }
.cube.show-bottom {  }

.cube__face--front  { background: hsla(  0, 100%, 50%, 0.7); }
.cube__face--right  { background: hsla( 60, 100%, 50%, 0.7); }
.cube__face--back   { background: hsla(120, 100%, 50%, 0.7); }
.cube__face--left   { background: hsla(180, 100%, 50%, 0.7); }
.cube__face--top    { background: hsla(240, 100%, 50%, 0.7); }
.cube__face--bottom { background: hsla(300, 100%, 50%, 0.7); }

.cube__face--front  { transform: rotateY(  0deg) translateZ(100px); }
.cube__face--right  { transform: rotateY( 90deg) translateZ(100px); }
.cube__face--back   { transform: rotateY(180deg) translateZ(100px); }
.cube__face--left   { transform: rotateY(-90deg) translateZ(100px); }
.cube__face--top    { transform: rotateX( 90deg) translateZ(100px); }
.cube__face--bottom { transform: rotateX(-90deg) translateZ(100px); }

.scene {
  width: 200px;
  height: 200px;
  margin: 80px;
  perspective: 400px;
}

.cube {
  width: 200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transform: translateZ(-100px);
  transition: transform 1s;
}

.cube__face {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid black;
  line-height: 200px;
  font-size: 40px;
  font-weight: bold;
  color: white;
  text-align: center;
}
</style>