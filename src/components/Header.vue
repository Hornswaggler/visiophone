<template>
  <div class="fred" style="height:100px;width:100%;display:flex;justify-content:flex-left;padding:1em;">
    <img style="height:100%;" src="../assets/Face_Icon.png"/>
    
    <!-- xp bar -->
    <div style="width:15em;display:flex;flex-direction:column;align-items:flex-start;padding-left:1em;justify-content:center;">
      <div>Visiodiamonds:420&#9830;</div>
      <div style="width:75%;height:1em;background-color:grey;margin-top:0.25em;">
        <div style="height:100%;width:75%;background-color:#FF3399"></div>
      </div>
    </div>
    <div style="flex:0.3"></div>
    <div style="width:15em;display:flex;flex-direction:column;align-items:flex-start;padding-left:1em;justify-content:center;">
      <visio-man>
        <input style="height:2em;width:25em;" type="text"/>
      </visio-man>
    </div>
  </div>
</template>
<script>
import VisioMan from './VisioMan.vue';

export default{
  name:'Header',
  components:{
    VisioMan
  }
}
</script>