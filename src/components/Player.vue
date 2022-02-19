<template>
 <img :src="require(`@/assets/Comp_boi_walkin.gif`)" style="transition: transform 0.24s linear 0s;" :style="{transform : transform}"/>
</template>
<script>
export default {
  name: 'Player',
  props:{
    x: Number,
    y: Number
  },
  computed:{
    transform(){
      return `translate(${this.x}px, ${this.y})`;
    }
  }
  // data: () => ({
  //   x:0,
  //   y:0
  // })
}

// class Player {
//   constructor( { x, y, width } ) {
//     this.x = x;
//     this.y = y;
//     const imageWidth = IMAGE_SCALAR * width;
//     this.image = new Image(imageWidth, imageWidth);
//     this.image.src = ;




//     const encoder = new GIFEncoder();
//     encoder.setRepeat(0);
//     encoder.setQuality(1);
//     encoder.setSize(imageWidth, imageWidth);
//     console.log('Encoder', encoder);
//   }

//   setLocation({x,y}){
//     this.x = x;
//     this.y = y;
//   }

//   draw({ width, ctx }) {
//     const imageWidth = IMAGE_SCALAR * width;

//     const xoffset = 5;
//     const yoffset = 7

//     const {x, y} = this;

//     try{
//       ctx.drawImage(this.image, xoffset + (width * x), yoffset + (width * y), imageWidth, imageWidth);
//     }catch(e){
//       console.error(e);
//     }
//   }
// }
</script>
