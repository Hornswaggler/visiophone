<template>
  <div class="responsive-layout-side-navigation">
    <div class="flex-1">
      <div class="site-name">
        <site-logo />
      </div>
      <div
        v-for="option in navigationItemsForUser"
        :key="option.slug"
        class="side-navigation-option"
        :class="{ selected: currentSlug === option.slug }"
        @click="onNavigationItemClicked(option.slug)"
      >
        <img :src="option.icon">
        <div>{{ option.title }}</div>
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
  computed:{
    ...mapGetters('nav', ['navigationItemsForUser']),
    ...mapState('nav', ['currentSlug']),
  },

  methods: {
    onNavigationItemClicked(slug) {
      this.$store.dispatch('nav/navigateToSlug', slug);
    }
  }
}
</script>
