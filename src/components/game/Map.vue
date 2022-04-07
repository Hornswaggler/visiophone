<template>
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
</template>
<script>
export default {
  name:'Map',
  async mounted(){
    await this.$store.dispatch('game/initMap');
  }
  
}
</script>