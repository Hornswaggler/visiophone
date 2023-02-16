<template>
  <div class="responsive-layout">
    <div class="responsive-layout-body">
      <side-navigation />
      <div class="responsive-layout-body-content">
        <Header />
        <router-view class="page-body"/>
        <page-footer/>
      </div>
    </div>
  </div>
</template>
<script>
import Header from '@/components/layout/Header.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import PageFooter from '@/components/layout/PageFooter.vue';

export default {
  name: 'ResponsiveLayout',
  components: {
    Header,
    SideNavigation,
    PageFooter
  }
}
</script>