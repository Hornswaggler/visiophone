<template>
  <div class="centered-responsive-layout">
    <div class="responsive-margin" />
    <div class="flex layout-centered-body">
      <side-navigation style="flex:0.25" />
      <slot
        name="content"
        style="height:100vh;width:100%;"
      />
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

.sample-search-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>