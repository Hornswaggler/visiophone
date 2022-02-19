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
}
</script>
