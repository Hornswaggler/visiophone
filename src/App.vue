<template>
  <div id="app">
    <!-- TODO inline Styles -->
    <div style="position:absolute;height:100vh;width:100vw;z-index:50;opacity:0.9;">
      <BaseLayout/>
    </div>
  </div>
</template>

<script>
 import BaseLayout from '@/components/layout/BaseLayout.vue';
 import { axiosInit } from '@/axios.js';
 import {config} from '@/config.js';

export default {
  name: 'App',
  components: {
    BaseLayout
  },

  async mounted(){
    await this.$store.dispatch('user/initialize');
    const result = await axiosInit();
    console.log('Mounted', config);
  }
}
</script>

<style lang="scss">
@import "@/styles/main.scss";

// TODO: ^^^ file can only be imported into a single component, should probably resolve this...

.responsive-margin {
  @include for-size(xl){
    width: 25vw;
  }
  width: 0vw;
}

.layout-centered-body {
  width:100vw;
}



</style>
