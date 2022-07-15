<template>
  <div
    @click="onOverlayClicked"
    v-if="show" class="loading"
    :class="{ show: fade }"
  >
    <div v-if="loading" class="lds-facebook"><div></div><div></div><div></div></div>
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
.loading {
  position:absolute;
  width:100%;
  height:100%;
  z-index:100;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s linear 0s;
  background-color:black;
  &.show{
    opacity: 0.75;
  }
}

.lds-facebook {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: #fff;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}

.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}

.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}

@keyframes lds-facebook {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}

</style>
