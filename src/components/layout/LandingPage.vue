<template>
  <div 
    class="landing-page"
    :style="{backgroundImage: 'url(\'' + require('@/assets/Visioland.png') + '\')'}"
  >
    <div class="gradient-background fill" />
    <visio-man>
      <div
        class="vp-button p0 login-button"
        @click="onLogin"
      >
        LOGIN
      </div>
    </visio-man>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import VisioMan from '@/components/common/VisioMan.vue';

// TODO technically this should be a statically served asset that requires no vue to run...

export default {
  name: 'LandingPage',
  components: {
    VisioMan
  },
  computed: {
    //...mapState('user',['authenticated', 'msal']),
    //...mapGetters('user',['userName', 'accessToken', 'idToken'])

  },
  methods:{
    async onLogin() {
      try{
        this.$store.commit('app/isLoading', true);
        const valid = await this.$store.dispatch('user/login');
        if(valid) {
          this.error = '';
          this.$store.commit('user/authenticated', true);
          this.$router.push('/sample');
        } else{
          this.error = 'Supplied credentials were incorrect.';
        }
      } catch(e) {
        //consume console.error('Login failed', e);
      } finally {
        this.$store.commit('app/isLoading', false);
      }
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
.landing-page {
  position:relative;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
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