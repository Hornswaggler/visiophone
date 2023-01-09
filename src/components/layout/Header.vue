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

        <div class="header-user-menu flex-1 justify-end">

          <span
            class="pr1 header-custom-user-name"
          >{{ customUserName }}</span>

          <img
            class="circle"
            :src="profileImg"
            @click="onUserMenuClicked"
          >
        </div>
      </div>
      <div class="header-search-input-background" />
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
      await this.$store.dispatch('dropdown/hideDropdown', { showLoading: false, opacity: '0' });
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