<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <side-navigation />
    </template>
    <template v-slot:content>
      <div style="height:100vh;width:100%;">
        <Header />
        <scrolling-container
          :on-scroll-limit-reached="onScrollLimitReached"
        >
          <template v-slot:scrolling-content>
            <router-view />
          </template>
        </scrolling-container> 
      </div>
    </template>
  </centered-responsive-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import Header from '@/components/layout/Header.vue';

export default {
  name: 'SamplePage',
  components: {
    CenteredResponsiveLayout,
    ScrollingContainer,
    SideNavigation,
    Header
  },

  computed: {
    ...mapGetters('user', ['idToken']),
  },

  methods: {
    onScrollLimitReached(){
      const {idToken:token} = this;
      this.$store.dispatch('sample/loadMoreSamples', {token});
    },
  }
} 
</script>

<style lang="scss">

.sample-search-input-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(33, 35, 35);
  z-index: -2
}

.sample-search-input-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.sort-icon {
  padding-right: 0.5em;
  font-size: 1.5em;
  justify-content: center;
  align-content: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.25s ease, color 0.25s ease;
  color: darkgray;

  &:hover {
    transform: scale(1.2);
    color: white;
  }

  &.selected {
    transform:scale(1.1);
    color:white;
  }
}
</style>