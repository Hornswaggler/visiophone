<template>
  <div>
    <div
      class="side-navigation-overlay"
      :style="{ ['z-index']: showMenu ? 2 : -1}"
      @click="onBackgroundClicked"
    />
    <div
      class="responsive-layout-side-navigation"
      :class="{'show-nav': showMenu}"
      style="z-index:2;"
    >
      <span 
        style="width:100%;cursor:pointer;"
        @click="goHome"
      ><site-logo />
      </span>
      <div
        v-for="option in sideNavigationItemsForUser"
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
    ...mapGetters('user',['stripeAccountStatus']),
    sideNavigationItemsForUser(){
      return this.sideNavigationMenuItems
        .filter(m =>  m.accountStatus.includes(this.stripeAccountStatus));
    }
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
