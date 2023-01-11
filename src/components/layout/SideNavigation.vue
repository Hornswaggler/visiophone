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
      <div style="height:10vh; margin-top:0;display:flex;flex-direction: column;align-items: center;justify-content: space-around;">
        <site-logo />
      </div>

      <div
        v-for="option in sideNavigationItemsForUser"
        :key="option._id"
        class="side-navigation-option"
        :class="{ selected: sideNavigationIndex === option.id }"
        @click="onMenuItemSelected(option)"
      >
        <font-awesome-icon 
          class="form-icon"
          :icon="option.icon"
        />
        <div>{{ option.title }}</div>
      </div>

      <div class="fill flex-1 flex flex-column justify-end">
        <img
          class="circle p1"
          :src="profileImg"
          @click="onUserMenuClicked"
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import SiteLogo from './SiteLogo.vue';

export default {
  name:'SideNavigation',
  components:{
    SiteLogo
  },
  data: () => ({
    inputWidth: '10em',
    menuItems: {
      logout:{
        displayName: 'Log Out',
        handler: async ({$store, $router}) => {
          await $store.dispatch('app/hideOverlay');
          await $store.dispatch(
            'dropdown/hideDropdown',
            {
              showLoading: false, 
              opacity: '0'
            }
          );
          if (await $store.dispatch('user/logout')) {

            $router.push('/landingPage');
          }
        }
      }
    }
  }),
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
    ...mapState('app',['sideNavigationMenuItems', 'sideNavigationIndex', 'showMenu']),
    ...mapState('user', ['profileImg']),
    ...mapGetters('user',['stripeAccountStatus']),
    sideNavigationItemsForUser(){
      return this.sideNavigationMenuItems
        .filter(m =>  m.accountStatus.includes(this.stripeAccountStatus));
    }
  },
  methods:{
    async onUserMenuClicked(e) {
      const { clientX = 0, clientY = 0 } = e;

      await this.$store.dispatch('dropdown/showDropdown', {
        clientX: `${clientX}px`,
        clientY: `${clientY}px`,
        menuItems: this.menuItems,
        onChanged: this.onFormDropdownChanged
      });

      this.$nextTick(() => {
        this.$store.commit('dropdown/setItemWidth', this.inputWidth);
      });

      this.$store.dispatch('app/showOverlay', { showLoading: false, opacity: '0.9' });
    },
    async onFormDropdownChanged() {
      await this.$store.dispatch('dropdown/hideDropdown', { showLoading: false, opacity: '0' });
    },
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
