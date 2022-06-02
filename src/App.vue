<template>
  <div id="app">
    <div style="position:absolute;height:100vh;width:100vw;z-index:50;opacity:0.9;">
      <BaseLayout/>
    </div>
  </div>
</template>

<script>
 import BaseLayout from '@/components/layout/BaseLayout.vue';
 import config from '@/config.js';
 import {axios, axiosInit} from '@/axios.js';

 console.log('Loaded config:', config, axios);

export default {
  name: 'App',
  components: {
    BaseLayout
  },

  async mounted(){
    await this.$store.dispatch('user/initialize');
    const result = await axiosInit();
    console.log('Axios Init', result);
    // const response = await axios.get('https://visiophone.wtf/secure/testapi');
    // console.log('RESPONSE FROM visiophone', response);
    // console.log('mounted', process.env.VUE_APP_BASE_URL);
  }
}
</script>

<style lang="scss">
@import "@/styles/main.scss";
</style>
