<template>
  <div
    class="overlay"
    :class="{ show: showOverlay }"
    @click="onOverlayClicked"
  >
    <div
      v-if="loading"
      class="lds-facebook"
    >
      <div />
      <div />
      <div />
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';

export default {
  name: "Loading",
  data: () => ({
    show: false,
    fade:false
  }),
  
  computed: {
    ...mapState('app', [
      'isLoading', 
      'opacity', 
      'loading',
      'showOverlay',
      'closeOverlayOnclick'
    ]),
    ...mapState('dropdown', ['onChanged'])
  },

  watch:{
    showOverlay(value){
      if(value){
        this.show = true;
        this.$nextTick(()=>{
          setTimeout(()=>{
            this.fade = true;
          }, 0);
        });
      } else {
        this.show = false;
        this.fade = false;
      }
    },
  },

  methods: {
    onOverlayClicked() {
      this.onChanged({value: false});
      if(this.closeOverlayOnclick) this.$store.dispatch('app/hideOverlay');
    }
  }
}
</script>
<style lang="scss">



</style>
