<template>
  <div class="responsive-layout-side-navigation">
    <div class="flex-1 p1">
      <!-- TODO: Fix this: -->
      <div style="margin-top:0;display:flex;flex-direction: column;align-items: center;justify-content: space-around;">
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
    </div>
    <div class="flex-1 flex flex-column justify-end p1 ">
      <img
        class="circle"
        :src="profileImg"
        @click="onUserMenuClicked"
      >
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import SiteLogo from './SiteLogo.vue';
import { AUTH } from '@/router/routeNames';

export default {
  name:'SideNavigation',
  components:{
    SiteLogo
  },
  data: () => ({
    inputWidth: '10rem',
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

            $router.push(`/${AUTH}`);
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
      this.$store.dispatch('app/showOverlay', { showLoading: false, opacity: '0.9' });

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

    },
    async onFormDropdownChanged() {
      await this.$store.dispatch('dropdown/hideDropdown', { showLoading: false, opacity: '0' });
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
