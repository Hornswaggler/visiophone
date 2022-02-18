<template>
 <div style="color:#66FF00;">

 <div class="css-selector">
    <Header/>
    <Navigation/>
  </div>

  <div 
    class="css-selector"
    style="width:100%;display:flex;flex-direction:column;overflow-y:auto;height: calc(100vh - 172px)"
  >
    <VisioConsole/>
  </div>
  
</div>
</template>
<script>
import Navigation from '@/components/Navigation.vue';
import VisioConsole from '@/components/VisioConsole.vue';
import Header from '@/components/Header.vue'

export default {
  name:'Console',
   components: {
    Navigation,
    VisioConsole,
    Header
  },
}
</script>
