<template>
<div class="side-navigation-container">
   <!-- TODO: Logo Path Should be configurable -->
  <div 
    class="site-logo" 
    :style="{backgroundImage: 'url(\'' + require('@/assets/glitchy.gif') + '\')'}"
  ></div>
  <div class="user-name-container">
    {{userName}}
  </div>
  <div
    v-for="option in menuOptions" 
    :key="option.id"
    @click="selectedMenuOption = option._id"
    class="navigation-button"
    :class="{selected: selectedMenuOption == option._id}"
  >{{option.name}}</div>
</div>
</template>
<script>
import {mapGetters} from 'vuex';

export default {
  name:'SideNavigation',
  data: () => ({
    selectedMenuOption: 0,
    menuOptions: [
      {name: 'Browse'},
      {name: 'Featured'},
      {name: 'Random'},
      {name: 'Free'},
      {name: 'Presets'},
      {name: 'Library'}
    ].map((o,i) => ({...o,_id: i}))
  }),
  computed:{
    ...mapGetters('user',['userName'])
  },
  mounted(){
  }
}
</script>
<style lang="scss">

.user-name-container {
  height: 6.5em;
  color: #65FE00;
  display: flex;
  align-items: center;
  justify-content: center;
}
.site-logo {
  background-size: cover;
  width: 100%;
  height: 5.5em;
  background-repeat: no-repeat;
  aspect-ratio: 16/9;
  background-position: center;
}

.side-navigation-container {
  background-color:rgb(33, 35, 35);
  margin: 0 1em;
  width:100%;
  color: rgb(161, 161, 162);
  display:flex;
  flex-direction: column;
  border-radius: 10px;
}
</style>