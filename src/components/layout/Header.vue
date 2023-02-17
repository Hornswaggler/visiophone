<template>
  <div class="header-container flex">
    <div class="flex-1">
    </div>
    <div class="pr1 flex align-center">
      <img
        class="circle "
        :src="profileImg"
        @click="onUserMenuClicked"
      >
    </div>
  </div>
<!-- 
  <carousel
    class="header-container"
    :elements="headerElements"
  >
    <div class="fill flex justify-end"></div>
  </carousel>
-->
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import Carousel from '@/components/form/Carousel.vue';

const headerElements = [
  'https://visiophone.wtf/avatars/Visioland_text.png',
  'https://visiophone.wtf/avatars/crispy.png',
  'https://visiophone.wtf/avatars/JedsSmoothInfluencercore.png',
  'https://visiophone.wtf/avatars/Psy.png',
];

export default {
  name:'Header',
  components:{
    Carousel
  },
  data:() => ({
    headerElements,
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
    },
  }),
  computed:{
    ...mapState('user', ['profileImg']),
    ...mapGetters('nav', ['breadcrumbs'])
  },
  methods: {
    async onUserMenuClicked(e) {
      this.$store.dispatch('app/showOverlay', { showLoading: false, opacity: '0.9' });

      const { clientX = 0, clientY = 0 } = e;

      await this.$store.dispatch('dropdown/showDropdown', {
        clientX,
        clientY,
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
  }
}
</script>