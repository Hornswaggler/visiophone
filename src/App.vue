<template>
  <div id="app">
    <!-- TODO inline Styles -->
    <div class="app-content-container">
      <BaseLayout />
    </div>
  </div>
</template>

<script>
 import BaseLayout from '@/components/layout/BaseLayout.vue';
 import { axiosInit } from '@/axios.js';

export default {
  name: 'App',
  components: {
    BaseLayout
  },

  async mounted(){
    await axiosInit();
    try{
      // TODO Standardize / templatize route names "magic number" 
      if(await this.$store.dispatch('user/initialize')) {
        this.$router.push('/sample');
      }
    } catch(err){
      //consume console.error('Error occurred in auth check', err);
    }
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

.app-content-container {
  position:absolute;
  height:100vh;
  width:100vw;
  z-index:50;
}



</style>
