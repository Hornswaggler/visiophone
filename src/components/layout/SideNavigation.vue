<template>
  <div class="side-navigation-menu">
    <site-logo />
    <div
      v-for="option in sideNavigationMenuItems"
      :key="option._id"
      class="side-naviagation-option"
      :class="{ selected: sideNavigationIndex === option.id }"
      @click="onMenuItemSelected(option)"
    >
      <font-awesome-icon 
        class="form-icon"
        :icon="option.icon"
      />
      <div>{{ option.title }}</div>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapState} from 'vuex';
import SiteLogo from './SiteLogo.vue';

export default {
  name:'SideNavigation',
  components:{
    SiteLogo
  },
  data: () => ({
  }),
  computed:{
    ...mapState('app',['sideNavigationMenuItems','sideNavigationIndex']),
    ...mapGetters('user',['userName'])
  },
  methods:{
    onMenuItemSelected({id,slug}) {
      if(this.sideNavigationIndex !== id) {
        this.$store.commit('app/setSideNavigationIndex', id )
        this.$router.push(slug);
      }
    }
  }
}
</script>
<style lang="scss">

.side-navigation-menu {
  box-shadow: 0px 4em 4em rgba(100, 100, 100, 0.4);

  color:white;
  height:100%;
  width:16em;
  display:flex;
  align-items: flex-end;
  flex-direction: column;

  .side-naviagation-option {
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    max-height:2em;
    min-height:2em;
    width:75%;
    display: flex;
    justify-content: space-evenly;
    margin-top: 1em;
    transition: all 0.18s linear;
    cursor:pointer;

    &:not(.selected){
      &:hover{
        background-color: white;
        color: black;
      }
    }

    &.selected{
      background: linear-gradient(to  top, rgba(75, 75, 75, 0.503), rgba(196, 196, 196, 0.756));
    }
  }
}









.navigation-button {
  margin:0.5em 1em;
  background-color:transparent;
  cursor:pointer;
  transition: all 0.5s ease-in-out;
  border-radius: 10px;

  &:hover {
    background-color:white;
    color:black;
    scale: 1.25;
  }

  &.selected {
    background-color:rgb(17, 17, 17);
  }
}

.user-name-container {
  height: 6.5em;
  color: #65FE00;
  display: flex;
  align-items: center;
  justify-content: center;
}


// .side-navigation-container {
//   max-width: 8em;
//   width:100%;
//   background-color: rgba(33, 35, 35, 0.9);
//   margin: 0 1em;
//   color: rgb(161, 161, 162);
//   display:flex;
//   flex-direction: column;
//   border-radius: 10px;
// }
</style>