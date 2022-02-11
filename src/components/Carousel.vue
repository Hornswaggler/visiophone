<template>
  <div>
    <div 
      v-for="element in elements" 
      :key="element.id" 
      class="hover-zoom intro" 
      style="max-width:30vw;max-height:30vw;min-width:5vw;min-height:5vw;background-size:cover; border: solid white 3px;width:100%;height:100%;" 
      :style="{backgroundImage: 'url(\'' + require('@/assets/visioland_edit.png') + '\')'}"
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
      this.elements.push({id: i,  path: '@/assets/visioland_edit.png'});
    }
    console.log(this.elements);
  }
}
</script>
<style lang="scss">
.intro{
    background:url('https://newevolutiondesigns.com/images/freebies/cool-wallpaper-3.jpg'),linear-gradient(233deg, #e56420, #c22525, #3d9c31, #37bbde);
    width:100%;
    height:100vh;
    background-size:cover;
    background-blend-mode: hard-light;
    animation: hue-rotate 3s linear infinite;
}

@keyframes hue-rotate {
  from {
    -webkit-filter: hue-rotate(0);
    -moz-filter: hue-rotate(0);
    -ms-filter: hue-rotate(0);
    filter: hue-rotate(0);
  }
  to {
    -webkit-filter: hue-rotate(360deg);
    -moz-filter: hue-rotate(360deg);
    -ms-filter: hue-rotate(360deg);
    filter: hue-rotate(360deg);
  }
}
</style>