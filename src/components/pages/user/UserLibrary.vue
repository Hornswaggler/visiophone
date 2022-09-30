<template>
  <div class="fill flex align-start flex-column vp-form">
    <div class="vp-form-row">
      <h3>Uploads</h3>
    </div>
    <div class="vp-form-row">
      <div
        v-for="sample in getForSale"
        :key="sample._id"
      >
        <img :src="sample.imgUrl">
      </div>
    </div>

    
    <div class="vp-form-row">
      <h3>Purchases</h3>
    </div>
    <div class="vp-form-row">
      <div
        v-for="sample in getOwned"
        :key="sample._id"
      >
        <img :src="sample.imgUrl">
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name:'UserLibrary',
  computed:{
    ...mapGetters('user',['getForSale', 'getOwned'])
  },
  mounted(){
    this.$store.commit('app/setSideNavigationIndex', 1);
  }
}
</script>
<style lang="scss">

</style>