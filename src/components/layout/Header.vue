<template>
  <div
    class="fill flex"
    style="height:6em;justify-content:space-between;"
  >
    <div
      class="flex align-center"
      style=";flex:1;"
    >
      <img
        :src="require(`@/assets/Face_Icon.png`)"
        style="height:100%;"
      >
      <div class="xp-container flex flex-column align-start">
        <div>Visiodiamonds:420&#9830;</div>
        <div class="status-bg">
          <div class="status-progress" />
        </div>
      </div>
    </div>
    <div
      style="flex:1;"
      class="xp-container flex align-center justify-center pl1"
    >
      <visio-man>
        <input
          style="height:2em;width:25em;"
          type="text"
        >
      </visio-man>
    </div>
    <div
      class="justify-end flex"
      style="flex:1;height:100%;width:100%;margin: 2em;"
    >
      {{ userName }}
    </div>
  </div>
</template>
<script>
import VisioMan from '@/components/common/VisioMan.vue';
import { mapState, mapGetters } from 'vuex'

export default{
  name:'Header',
  components:{
    VisioMan
  },
  computed: {
    ...mapState('user', ['userIcon']),
    ...mapGetters('user',['userName'])
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