<template>
  <div id="app">
    <div style="position:absolute;height:100vh;width:100vw;z-index:50;opacity:0.9;">
      <BaseLayout/>
    </div>
  </div>
</template>

<script>
 import BaseLayout from '@/components/layout/BaseLayout.vue';

export default {
  name: 'App',
  components: {
    BaseLayout
  }
}
</script>

<style lang="scss">
@import "@/styles/main.scss";
</style>
