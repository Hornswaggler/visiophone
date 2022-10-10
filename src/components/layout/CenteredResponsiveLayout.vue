<template>
  <div class="centered-responsive-layout">
    <div class="responsive-margin" />

    <div class="flex layout-centered-body">
      <slot name="side-panel" />
      <slot name="content" />
    </div>

    <div class="responsive-margin" />
  </div>
</template>
<script>
export default {
  name: 'CenteredResponsiveLayout',
}
</script>
<style lang="scss">
.centered-responsive-layout {
  display:flex;
  height:100vh;
}
</style>