<template>
  <div>
    <div class="flex selection-container">
      <div
        class="header-search-container"
      >
        <div 
          class="flex align-center flex-1" 
          style="padding-left:0.5em;"
        >
          <span
            class="mobile-nav-hamburger"
            style="cursor:pointer"
          >
            <font-awesome-icon
              class="form-icon"
              icon="fa-bars"
              @click="expandMenu"
            />
          </span>
          <span
            class="header-nav-icon"
            @click="onGo(-1)"
          >
            <font-awesome-icon 
              class="form-icon"
              icon="fa-angle-left"
            />
          </span>

          <span
            class="header-nav-icon"
            @click="onGo(1)"
          >
            <font-awesome-icon 
              class="form-icon pl1"
              icon="fa-angle-right"
            />
          </span>
        </div>

        <div
          class="header-search-input"
          style="flex:4;"
        >
          <div class="header-search-input-content">
            <form-input :on-changed="onSearchChanged" />
          </div>
        </div>

        <div class="header-user-menu flex-1 justify-end">
          <span
            class="pr header-custom-user-name"
            style="font-size:0.8em;"
          >{{ customUserName }}</span>

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
  computed: {
    ...mapGetters('user', ['profileImg', 'idToken']),
    ...mapState('user', ['userIcon', 'customUserName']),
    ...mapState('sample', ['sortType']),
    isGroupTypeSelected(){
      return this.sortType === SORT_TYPES.GROUP;
    },
    isListTypeSelected(){
      return this.sortType === SORT_TYPES.LIST;
    },
  },
  methods: {
    expandMenu(){
      this.$store.commit('app/setShowMenu', true);
    },

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

    onViewListClicked() {
      if(!this.isListTypeSelected) {
        this.$store.dispatch('sample/setSortType', SORT_TYPES.LIST);
      }
    },

    onViewGroupClicked() {
      if(!this.isGroupTypeSelected){
        this.$store.dispatch('sample/setSortType', SORT_TYPES.GROUP);
      }
    }
  },
 
}
</script>

<style lang="scss">

.header-search-container {
  display: flex;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  width: 100%;
  margin: 0 0.5em;

  .header-user-menu {
    background-color: transparent;
    height: 100%;
    display: flex;
    align-items: center;  }

  .header-search-input {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 0.5em;
    align-items: center;
  }
}

.header-search-input-content {
  max-width: 25em;
  border-radius: 16px;
  height: var(--vp-input-min-height);
}

.selection-container {
  background-color: rgba(33, 35, 35, 0.5);
  color: #ffffffa1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
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