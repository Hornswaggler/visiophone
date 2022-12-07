<template>
  <div 
    class="landing-page"
  >
  </div>
</template>

<script>
import { mapState } from 'vuex';
import VisioMan from '@/components/common/VisioMan.vue';

export default {
  name: 'LandingPage',
  components: {
    VisioMan
  },
  
  data:() => ({
    visioloandUrl: new URL('../../assets/Visioland.png', import.meta.url).href
  }),

  computed:{
    ...mapState('user', ['authenticated']),
    ...mapState('app', ['targetUrl'])
  },

  methods:{
    onSignup() {
      
    },
    async onLogout(){
      await this.$store.dispatch('user/logout');
      this.$store.commit('user/authenticated', false);
    },
    navTradeSamples () {
      this.$router.push('/upload');
    }
  }
}
</script>

<style lang="scss">

.signup-button {
  position: fixed;
  top: 1em;
  right: 1em;
  cursor: pointer;
  z-index: 1;
  opacity: 0.8;
  transition: all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover{
    opacity: 1;
    transform: scale(1.2);
  }
}

.login-button {
  background-color:grey;
  opacity: 0.75;
  cursor:pointer;
  z-index:1;
  height:12em;
  width:12em;
}

.gradient-background {
  position:absolute;
  background: linear-gradient(120deg,rgb(195, 140, 223),rgb(3, 53, 15),rgb(0, 255, 30));
  background-size: 180% 180%;
  animation: gradient-animation 18s ease infinite;
  opacity:0.5
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>