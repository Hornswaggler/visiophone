<template>
  <responsive-layout>
    <template v-slot:side-panel>
      <side-navigation />
    </template>
    <template v-slot:content>
      <div class="page-body">
        <!-- <Header style="height: 10vh;" /> -->
        <router-view/>
        <page-footer />
      </div>
    </template>
  </responsive-layout>
</template>
<script>
import ResponsiveLayout from '@/components/layout/ResponsiveLayout.vue';
import Header from '@/components/layout/Header.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import PageFooter from '@/components/layout/PageFooter.vue';

export default {
  name:'DefaultPageLayout',
  components:{
    ResponsiveLayout,
    Header,
    SideNavigation,
    ScrollingContainer,
    PageFooter
  },
  methods: {
    onScrollLimitReached() {
      this.$store.dispatch('sample/loadMoreSamples');
    },
  }
}
</script>