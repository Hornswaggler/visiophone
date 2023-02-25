<template>
  <div
    ref="app"
    id="app"
    class="position-relative"
  >
    <background />
    <form-dropdown />
    <loading />
    <shopping-cart-modal />
    <router-view v-if="authenticated" />
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { axiosInit } from '@/axios.js';
import config from '@/config';
import Background from '@/components/layout/Background.vue';
import Loading from '@/components/layout/Loading.vue';
import FormDropdown from '@/components/form/FormDropdown.vue';
import ShoppingCartModal from '@/components/common/ShoppingCartModal.vue';

export default {
  name: 'App',
  components: {
    Loading,
    Background,
    FormDropdown,
    ShoppingCartModal
  },

  computed: {
    ...mapState('user', ['authenticated'])
  },

  async mounted() {
    await axiosInit();

    try {
      await this.$store.dispatch('user/logon');
    }catch(e) {
      //consume
    }
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
</style>
