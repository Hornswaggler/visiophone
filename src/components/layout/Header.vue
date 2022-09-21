<template>
  <div>
    <div class="flex selection-container">
      <span @click="onGo(-1)">
        <font-awesome-icon 
          class="form-icon"
          icon="fa-angle-left"
        />
      </span>

      <span @click="onGo(1)">
        <font-awesome-icon 
          class="form-icon pl1"
          icon="fa-angle-right"
        />
      </span>
      <div
        class="header-search-container"
      >
        <div class="header-search-input">
          <div class="sample-search-input-content">
            <form-input :on-changed="onSearchChanged" />
          </div>
        </div>
        <div class="header-user-menu">
          <img
            class="header-profile-image circle"
            :src="profileImg"
            @click="onUserMenuClicked"
          >
        </div>
      </div>
      <div class="sample-search-input-background" />
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import FormInput from '@/components/form/FormInput.vue';
import {SORT_TYPES} from '@/store/modules/sample';

export default {
  name:'Header',
  components:{
    FormInput
  },

  data:() => ({
    inputWidth: '10em',
    menuItems: {
      settings:{
        displayName: 'Settings',
        handler: async({$router, $store}) => {
          await $store.dispatch('app/hideOverlay');
          $router.push('/user-settings');
        }
      },
    
      logout:{
        displayName: 'Log Out',
        handler: async ({$store, $router}) => {
          await $store.dispatch('app/hideOverlay');
          await $store.dispatch(
            '/dropdown/hideDropdown',
            {
              showLoading: false, 
              opacity: '0'
            }
          );
          if (await $store.dispatch('user/logout')) {
            $router.push('/landingPage');
          }
        },
      },

      settings:{
        displayName: 'Settings',
        handler: async({$router, $store}) => {
          await $store.dispatch('app/hideOverlay');

          // TODO: Standardize these...
          $router.push('/user-settings');
        }
      },

      logout:{
        displayName: 'Log Out',
        handler: async ({$store, $router}) => {
          await $store.dispatch('app/hideOverlay');
          await $store.dispatch(
            'dropdown/hideDropdown',
            {
              showLoading: false, 
              opacity: '0'
            }
          );
          if (await $store.dispatch('user/logout')) {

            $router.push('/landingPage');
          }
        }
      }
    }
  }),
  computed:{
    ...mapGetters('user', ['profileImg', 'idToken']),
    ...mapState('sample', ['sortType']),
    ...mapState('user', ['userIcon']),
    isGroupTypeSelected(){
      return this.sortType === SORT_TYPES.GROUP;
    },
    isListTypeSelected(){
      return this.sortType === SORT_TYPES.LIST;
    },
  },
  methods: {
    onGo(direction){
      this.$router.go(direction)
    },
  
    async onUserMenuClicked(e) {
      const { clientX = 0, clientY = 0 } = e;

      await this.$store.dispatch('dropdown/showDropdown', {
        clientX: `calc(${clientX}px - ${this.inputWidth})`,
        clientY: `${clientY}px`,
        menuItems: this.menuItems,
        onChanged: this.onFormDropdownChanged
      });

      this.$nextTick(() => {
        this.$store.commit('dropdown/setItemWidth', this.inputWidth);
      });

      this.$store.dispatch('app/showOverlay', { showLoading: false, opacity: '0.9' });
    },

    async onFormDropdownChanged() {
      await this.$store.dispatch('dropdown/hideDropdown', {showLoading: false, opacity: '0'});
    },

    onSearchChanged(query) {
      this.$store.dispatch('sample/search', {query, token: this.idToken });
    },

    onViewListClicked(){
      if(!this.isListTypeSelected){
        this.$store.dispatch('sample/setSortType', SORT_TYPES.LIST);
      }
    },

    onViewGroupClicked(){
      if(!this.isGroupTypeSelected){
        this.$store.dispatch('sample/setSortType', SORT_TYPES.GROUP);
      }
    }
  },
 
}
</script>

<style lang="scss">
.header-profile-image {
  height:3em;
  width:3em;
}

.header-search-container {
  display: flex;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  width: 100%;

  .header-user-menu {
    background-color: transparent;
    height: 100%;
    display: flex;
    align-items: center;  }

  .header-search-input{
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.sample-search-input-content {
  border: solid 2px grey;
  max-width: 25em;
  border-radius: 16px;
}

.selection-container {
  background-color: rgba(33, 35, 35, 0.5);
  color: #ffffffa1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1em;
  font-size: 1.2em;
  z-index: 1;
  
  .form-icon {
    font-size:0.5em;
    height:2em;
  }

  & > * {
    cursor: pointer;
    transition: color 0.2s ease-out;

    &:hover{
      color:white;
    }
  }
}
</style>