<template>
  <div class="centered-responsive-layout">
    <div class="responsive-margin" />
    <div class="flex layout-centered-body">
      <side-navigation style="flex:0.25" />
      <slot name="content" />
    </div>
    <div class="responsive-margin" />
  </div>
</template>
<script>
import SideNavigation from '@/components/layout/SideNavigation.vue';

export default {
  name: 'CenteredResponsiveLayout',
  components: { SideNavigation }
}
</script>
<style lang="scss">
.centered-responsive-layout {
  display:flex;
  height:100vh;
}
</style>