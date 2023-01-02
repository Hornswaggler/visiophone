<template>
  <div id="app" class="app-content-container">
    <BaseLayout />
  </div>
</template>

<script>
import {mapState} from 'vuex';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import { axiosInit } from '@/axios.js';
import config from '@/config';

export default {
  name: 'App',
  components: {
    BaseLayout
  },

  computed: {
    ...mapState('user', ['authenticated', 'isStripeApproved']),
    ...mapState('app', ['targetUrl', 'sideNavigationMenuItems'])
  },

  async mounted(){
    // this.initializePersistentStorage();



    this.$router.beforeEach(({path}, from, next) => {
      this.$store.commit(
        'app/setSideNavigationIndex',
        this.sideNavigationMenuItems.findIndex(({slug}) => slug === path) || 0
      );
      next();
    });
    await axiosInit();

    try{
      await this.$store.dispatch('user/logon');
    }catch(e) {
      //consume
    }
  },

  watch:{
    authenticated(newAuthenticated){
      if(newAuthenticated) this.$router.push(this.targetUrl);
    },
  }, 
  methods:{
    //TODO: Are we using this???
    initializePersistentStorage() {
      for(let i = 0; i < config.PERSISTENT_MUTATIONS.length; i++) {
        const key = config.PERSISTENT_MUTATIONS[i];
        const value = localStorage[key];

        if(value) {
          const parse = () => {
            try{
              return JSON.parse(value)
            } catch(e){
              return value;
            }
          };
          this.$store.commit(key, parse(value));
        }
      }

      this.$store.subscribe((context, state) => {
        const {type} = context;
        const index = type.indexOf('/');
        const module = index ? type.slice(0, index) : type;

        if(config.PERSISTENT_MUTATIONS.includes(type)) {
          const path = type.split('/');
          const value = state[path[0]][path[1]];
          const result = typeof value === 'string'
            ? value
            : JSON.stringify(value)

          localStorage.setItem(type,  result);
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/main.scss";

.header-custom-user-name {
  @include for-size(xs) {
    display: none;
  }
}

.mobile-nav-hamburger {
  @include for-size(xs) {
    display: block;
  }
  display: none;
}

.user-settings-form {
  flex-direction: column-reverse;
  .vp-form:first-child {
      padding-top: 1em;
    }
  @include for-size(md) {
    flex-direction: row;
    .vp-form:first-child {
      padding-top: 0;
    }
  }
}
</style>
