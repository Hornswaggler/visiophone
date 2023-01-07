<template>
  <div id="app">
    <div class="app-content-container">
      <BaseLayout />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import { axiosInit } from '@/axios.js';
import config from '@/config';
import routes from './router/routes';

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
      console.log('App.routes::: ', routes.meta.isPublic)
      // console.log()
      
      // await this.$store.dispatch('user/logon');
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

// TODO: ^^^ file can only be imported into a single component, should probably resolve this...

html{
  --image-editor-hw: 16em;
  --vp-input-min-height: 1.5em;
  --vp-cover-art-hw: 2em;
  --vp-cover-art-hw-expanded: 10em;
  --vp-form-text-size: 1em;
  --vp-form-select-option-font-size: 1.2em;
  --vp-form-select-option-color: rgb(226, 226, 226);
  --vp-form-select-option-background-color: rgb(14, 14, 14);
  --vp-highlight-color:rgba(20, 234, 253, 0.95);
  --vp-default-background-color: rgb(255 255 255 / 14%);
  --vp-side-navigation-background-color: rgb(44 47 50 / 62%);
  --vp-form-button-background-color:rgba(0, 0, 0, 0.656);
  --vp-form-button-hover-background-color: rgb(147, 147, 147);

  --vp-input-padding: 0.5em;
  --vp-side-navigation-width: 10em;
  --vp-header-height: 3em;
}

.responsive-margin {
  @include for-size(xl){
    width: 25vw;
  }
  width: 0vw;
}

.header-custom-user-name {
  @include for-size(xs) {
    display:none;
  }
}

.mobile-nav-hamburger {
  @include for-size(xs) {
    display: block;
  }
  display: none;
}

.sample-upload-form {
  display: flex;
  flex-direction: column-reverse;
  .vp-form {
    flex: 1;
  }
  .vp-form:first-child {
      padding-top:1em;
    }
  @include for-size(md) {
    flex-direction: row;
    .vp-form:first-child {
      padding-top:0;
    }
  }
}

.user-settings-form {
  flex-direction: column-reverse;
  .vp-form:first-child {
      padding-top:1em;
    }
  @include for-size(md) {
    flex-direction: row;
    .vp-form:first-child {
      padding-top:0;
    }
  }
}

.header-nav-icon {
  cursor: pointer;
  transition: color 0.2s ease-out;

  &:hover{
    color:white;
  }
  @include for-size(xs) {
    display:none;
  }
}

.layout-centered-body {
  width:100%;
  justify-content: center;
  position: relative;

  .side-navigation-menu {
    opacity: 0.87;
    transition: transform 0.28s, width 0.5s, margin 1s, background-color 1s;
    background-color:var(--vp-side-navigation-background-color);
    left:0;

    .xs-logo {
      display:none;
    }

     @include for-size(xs) {
      position:absolute;
      background-color:rgb(88 71 134 / 100%);
      width: 33vw;
      transform: translateX(-33vw);

      &.show-nav {
        transform: translateX(0);
      }

      .logo-container{
        display:none;
      }
    }
  }

  .header-search-container{
    .logo-container{
      width:0;

      .xs-logo {
        display:none;
      }

      .lg-logo {
        display:none;
      }
    }

    @include for-size(xs) {
      .logo-container {
        width: 100%;

        .xs-logo {
          display:block;
        }
      }
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
    height:calc(100vh - var(--vp-header-height) - 0.55em);

    @include for-size(xs) {
      height:calc(100vh - 10.75em);
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

  .page-footer-container {
    display:none;

    @include for-size(xs) {
      display:flex;
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
