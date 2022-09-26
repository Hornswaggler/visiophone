<template>
  <div class="side-navigation-menu">
    <span style="width:100%;"><site-logo /></span>
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
  // box-shadow: 1em 0 5em rgb(100 100 100 / 40%);
  box-shadow: -20px 20px 30px 0px rgba(0,0,0,0.75);

  color:white;
  height:100vh;
  width:16em;
  display:flex;
  align-items: flex-end;
  flex-direction: column;

  >div:first-of-type{
    margin-top:1em;
  }

  .side-naviagation-option {
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    max-height:2em;
    min-height:2em;
    background-color: rgba(33, 35, 35, 0.9);
    width:75%;
    display: flex;
    justify-content: space-evenly;
    margin-top: 2em;
    transition: all 0.18s linear;
    cursor:pointer;

    &:not(.selected){
      &:hover{
        background-color: white;
        color: black;
      }
    }

    &.selected{
      background: linear-gradient(to  top, rgba(75, 75, 75, 0.503), rgba(204, 203, 203, 0.756));
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
</style>