<template>
  <div>
    <div
      class="side-navigation-overlay"
      :style="{ ['z-index']: showMenu ? 2 : -1}"
      @click="onBackgroundClicked"
    />
    <div
      class="side-navigation-menu"
      :class="{'show-nav': showMenu}"
      style="z-index:2;"
    >
      <span 
        style="width:100%;cursor:pointer;"
        @click="goHome"
      ><site-logo />
      </span>
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
  props:{
    changeHandler:{
      type: Function,
      default: () => {}
    },
    link:{
      type: String,
      default:'/sample'
    }
  },
  computed:{
    ...mapState('app',['sideNavigationMenuItems','sideNavigationIndex', 'showMenu']),
    ...mapGetters('user',['userName'])
  },
  methods:{
    onBackgroundClicked() {
      this.$store.commit('app/setShowMenu', false);
    },
    onMenuItemSelected({id,slug}) {

      if(this.sideNavigationIndex !== id) {
        this.$store.commit('app/setSideNavigationIndex', id )
        this.$router.push(slug);
      }
      this.changeHandler();
    },
    goHome(){
      this.$router.push(this.link);
    }
  }
}
</script>
<style lang="scss">

.side-navigation-overlay {
  background-color:rgb(0 0 0 / 63%);
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  z-index: -1;
}

.side-navigation-menu {
  box-shadow: -20px 20px 30px 0px rgba(18, 18, 19, 0.75);
  background-color:#58478648;
  z-index:3;

  color:white;
  height:100vh;
  width:var(--vp-side-navigation-width);
  display:flex;
  align-items: center;
  flex-direction: column;

  >div:first-of-type{
    margin-top:1em;
  }

  .side-naviagation-option {
    border-top:1px solid white;
    display: flex;
    align-items: center;
    border-radius: 10px;
    max-height:1.5em;
    min-height:1.5em;
    background-color: rgba(33, 35, 35, 0.9);
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
      background: linear-gradient(to  top, rgba(180, 180, 180, 0.503), rgba(255, 255, 255, 0.839));
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