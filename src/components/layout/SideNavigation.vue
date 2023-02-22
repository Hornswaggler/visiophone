<template>
  <div class="responsive-layout-side-navigation">
    
    <div class="site-name">
        <site-logo />
    </div>
    <div class="flex-1 flex flex-column pb1">
      <div
        v-for="option in topNavItems"
        :key="option.slug"
        class="side-navigation-option"
        :class="{ selected: isItemSelected(option)}"
        @click="onNavigationItemClicked(option.slug)"
      >
        <img :src="option.icon">
        <div>{{ option.title }}</div>
      </div>
      <div class="flex-1">&nbsp;</div>
      <div
        v-for="option in bottomNavItems"
        :key="option.slug"
        class="side-navigation-option"
        :class="{ selected: isItemSelected(option)}"
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
    topNavItems() {
      return this.navigationItemsForUser.filter(option => option.slug !== '/settings')
    },
    bottomNavItems() {
      return this.navigationItemsForUser.filter(option => option.slug === '/settings')
    }
  },

  methods: {
    isItemSelected(option){
      if(this.currentSlug === option.slug){
        return true;
      } else {
        const children = (option.children || []);
        for(let i = 0; i < children.length; i++){
          if(this.currentSlug.includes(children[i].slug)) return true;
        }
      }

      return false;
    },
    onNavigationItemClicked(slug) {
      this.$store.dispatch('nav/navigateToSlug', slug);
    }
  }
}
</script>
