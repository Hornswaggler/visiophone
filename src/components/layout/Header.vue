<template>
  <div>
    <div class="flex header-container">
      <div
        class="header-search-container"
      >
        <div
          class="header-search-input"
          style="flex:2;"
        >
          <div class="header-search-input-content">
            <form-input :on-changed="onSearchChanged" />
          </div>
        </div>

        <!-- <div class="flex-1 align-start flex" style="cursor:pointer;" @click="onPurchaseVisiotokens">
          <div class="p1">
            <span>
              <font-awesome-icon 
                class="form-icon"
                icon="fa-gem"
                style="color:#22d522d4"
              />
            </span>
            <span style="padding-left:0.25em;">0</span>
            <span style="padding-left:0.25em;font-size: 0.65em;height:100%;">visiotokens</span>
          </div>
        </div> -->

        <div class="header-user-menu flex-1 justify-end">

          <span
            class="pr1 header-custom-user-name"
            style="font-size:0.65em;"
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
import SiteLogo from './SiteLogo.vue';

export default {
  name:'Header',
  components:{
    FormInput,
    SiteLogo
  },

  data:() => ({
    inputWidth: '10em',
    menuItems: {
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
    ...mapState('user', ['customUserName', 'profileImg']),
    ...mapState('sample', ['sortType']),
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

    onPurchaseVisiotokens(){
      console.log('purchasing visiotokens');
      this.$store.dispatch('user/getVisioTokens');

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
      this.$store.dispatch('sample/search', {query });
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

  .header-user-menu {
    background-color: transparent;
    display: flex;
    align-items: center;  }

  .header-search-input {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.header-search-input-content {
  border-radius: 1em;
  flex:1;
}

.header-container {
  padding: 0 1em;
  height: var(--vp-header-height);
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
}
</style>