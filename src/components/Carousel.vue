<template>
  <div>
    <div 
      v-for="element in elements" 
      :key="element.id" 
      class="hover-zoom" 
      style="max-width:17vw;max-height:17vw;min-width:5vw;min-height:5vw;background-size:cover; border: solid white 3px;width:100%;height:100%;" 
      :style="{backgroundImage: 'url(\'' + require('@/assets/Visioland.png') + '\')'}"
    >
    </div>

  </div>
</template>
<script>
export default {
  name:'Carousel',
  data: () => ({
   elements: []
  }),
  created(){
    console.log('Here we are..');
    for(let i = 0; i < 3; i ++) {
      this.elements.push({id: i,  path: '@/assets/Visioland.png'});
    }
    console.log(this.elements);
  }
}
</script>
<style lang="scss">

</style>