<template>
  <div
    class="site-logo"
    :style="{backgroundImage: 'url(\'' + require('@/assets/glitchy.gif') + '\')'}"
  />
</template>

<script>
export default {
  name:'SiteLogo'
}
</script>

<style lang="scss">
.site-logo {
  background-size: cover;
  width: 100%;
  // height: 5.5em;
  background-repeat: no-repeat;
  aspect-ratio: 16/9;
  background-position: center;
}
</style>