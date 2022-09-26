<template>
  <div id="app">
    <!-- TODO inline Styles -->
    <div class="app-content-container">
      <BaseLayout />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import { axiosInit } from '@/axios.js';
import moment from 'moment';
import config from '@/config';

const DEFAULT_HOME = '/sample';

const PERSISTENT_MODULES = [
  'sample',
];

export default {
  name: 'App',
  components: {
    BaseLayout
  },

  computed: {
    ...mapState('user', ['authenticated']),
    ...mapState('app', ['targetUrl', 'sideNavigationMenuItems'])
  },

  async mounted(){
    this.initializePersistentStorage();

    this.$router.beforeEach(({path, fullPath}, from, next) => {
      try {
        this.$nextTick(() => {
          if(this.authenticated && path === '/landingPage') {
            return next('/sample');
          }

          this.$store.commit('app/setSideNavigationIndex', this.sideNavigationMenuItems.findIndex(({slug}) => slug === path) || 0);
        });
      } finally {
        next();
      }
    });

    await axiosInit();
    try{
      // TODO Standardize / templatize route names "magic number" 
      if(await this.$store.dispatch('user/initialize')) {
        this.$router.push(this.targetUrl || DEFAULT_HOME);
      }
    } catch(err){
      //consume console.error('Error occurred in auth check', err);
    }
  },
  methods:{
    initializePersistentStorage(){
      const currentTime = moment().valueOf();
      for(let i = 0; i < PERSISTENT_MODULES.length; i++) {
        const storeModuleName = PERSISTENT_MODULES[i];
        const storeModuleJson = localStorage.getItem(storeModuleName);

        if(storeModuleJson){
          try{
            const storeModule = JSON.parse(storeModuleJson);
            const samples = storeModule.samples;

            //TODO: refactor this stuff into the store layer
            if(Object.keys(samples).find(key => currentTime - samples[key].lastRefresh > config.VUE_APP_STALE_RECORD_THRESHOLD)){
              break;
            }

            this.$store.dispatch(`${storeModuleName}/initFromStorage`, storeModule);

            Object.keys(storeModule).forEach(key => {
              this.$store.commit(`${storeModuleName}/assignObject`, {
                key,
                value: storeModule[key]
              })
            })
          }catch(e){
            console.error(e);
          }
        }
      }

      this.$store.subscribe(({type}, {sample}) => {
        if(PERSISTENT_MODULES.find(m => type.startsWith(m))) {
          localStorage.setItem('sample', JSON.stringify(sample));
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/main.scss";

// TODO: ^^^ file can only be imported into a single component, should probably resolve this...

html{
  --image-editor-hw: 16em;
  --vp-input-min-height: 2em;
  --vp-form-text-size: 1em;
  --vp-form-select-option-font-size: 1.2em;
  --vp-form-select-option-color: rgb(226, 226, 226);
  --vp-form-select-option-background-color: rgb(14, 14, 14);
  --vp-input-background-color: rgba(17, 17, 17, 0.7);
  --vp-input-padding: 0.5em;
}


.responsive-margin {
  @include for-size(xl){
    width: 25vw;
  }
  width: 0vw;
}

.layout-centered-body {
  width:100%;
  justify-content: center;

  .side-navigation-menu {
    opacity: 1;
    transition: opacity 1s, width 1s, margin 1s; 

     @include for-size(xs) {
      width: 0;
      margin:0;
      opacity: 0;
    }
  }

  .sample-search-input {
    @include for-size(xs) {
      max-width: 100vw;
      margin:0;
    }
  }

  .sample-search-container {
    @include for-size(xs) {
      justify-content: flex-start;
      flex-direction: row;
      justify-content: center;
    }
  }

  .sample-detail-container.isCollapsed .sample-detail-image-card .form-image {
    @include for-size(xs) {
      min-height: 6em;
      min-width: 6em;
    }
  }

  .scrollbar {
    @include for-size(xs) {
      max-height:calc(100vh - 5em);
    }
  }

  .scrolling-container {
    @include for-size(xs) {
      padding:0;
      justify-content: center;
      align-items: center;
      padding: 0;
    }
  }

  .sample-detail-container {
    &.isCollapsed{
      .sample-detail-image-card {
        .form-image {
          @include for-size(xs) {
            min-height: 8em;
            min-width: 8em;
          }
        }
      }
      .sample-details {
        padding:0;
        .form-card {
          padding:0;
        }
      }
    }
  }
}

.app-content-container {
  position:absolute;
  height:100vh;
  width:100vw;
  z-index:50;
}



</style>
