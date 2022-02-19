<template>
  <div class="fill flex justify-left p1">
    <img class="h100" :src="require(`@/assets/Face_Icon.png`)"/>
    
    <!-- xp bar -->
    <div class="xp-container flex flex-column align-start">
      <div>Visiodiamonds:420&#9830;</div>
      <div class="status-bg">
        <div class="status-progress"></div>
      </div>
    </div>
    <div class="spacer"></div>
    <div class="xp-container flex flex-column align-start justify-center pl1">
      <visio-man>
        <!-- todo refactor -->
        <input style="height:2em;width:25em;" type="text"/>
      </visio-man>
    </div>
  </div>
</template>
<script>
import VisioMan from '@/components/common/VisioMan.vue';

export default{
  name:'Header',
  components:{
    VisioMan
  }
}
</script>
<style lang="scss">
.xp-container {
  width:15em; 
}

.spacer {
  flex:0.3
}

.status-bg {
  width:75%;
  height:1em;
  background-color:grey;
  margin-top:0.25em;

  .status-progress {
    height:100%;
    width:75%;
    background-color: #FF3399;
  }
}
</style>