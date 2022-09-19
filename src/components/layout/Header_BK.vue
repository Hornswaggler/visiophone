<template>
  <div class="sample-search-input">
    <div class="sample-search-input-content">
      <form-input
        :on-changed="onSearchChanged"
      />
      <div class="fill flex justify-end pr1">
        <bootleg-list-icon
          :on-click="onViewListClicked"
          :selected="isListTypeSelected"
        />

        <bootleg-group-icon 
          :on-click="onViewGroupClicked"
          :selected="isGroupTypeSelected"
        />

        <div class="user-button">
          <div
            class=" user-icon"
            :style="{ background: `center / contain no-repeat  url('${userIcon}')` }"
            @click="onUserMenuClicked"
          />
        </div>
      </div>
    </div>
    <div class="sample-search-input-background" />
  </div>
</template>

<script>
import {mapState} from 'vuex';
import FormInput from '@/components/form/FormInput.vue';
import BootlegListIcon from '@/components/form/BootlegListIcon.vue';
import BootlegGroupIcon from '@/components/form/BootlegGroupIcon.vue';
import {SORT_TYPES} from '@/store/modules/sample';

export default {
  name:'Header',
  components:{
    BootlegGroupIcon,
    BootlegListIcon,
    FormInput
  },
  data:() => ({
    inputWidth: '10em',
    menuItems: {
      settings:{
        displayName: 'Settings',
        handler: async({$router, $store}) => {
          await $store.dispatch('app/hideOverlay');
          $router.push('user-settings');
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
            $router.push('landingPage');
          }
        },
        
      },

      settings:{
        displayName: 'Settings',
        handler: async({$router, $store}) => {
          await $store.dispatch('app/hideOverlay');
          $router.push('user-settings');
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
            $router.push('landingPage');
          }
        }
      }
    }
  }),
  computed:{
    ...mapState('sample', ['sortType']),
    ...mapState('user', ['userIcon', 'apiToken']),
    isGroupTypeSelected(){
      return this.sortType === SORT_TYPES.GROUP;
    },
    isListTypeSelected(){
      return this.sortType === SORT_TYPES.LIST;
    },
  },
  methods: {
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
    async onFormDropdownChanged(value) {
      await this.$store.dispatch('dropdown/hideDropdown', {showLoading: false, opacity: '0'});
    },
    onSearchChanged(query) {
      const {idToken:token} = this;
      this.$store.dispatch('sample/search', {query, token });
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
  
.user-button {
  height:100%;
  display:flex;
  justify-content: flex-end;
  align-items: center;
}


.user-icon {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 2.5em;
  height:2.5em;
  cursor:pointer;
  transition: all 0.08s ease-in-out;
  &:hover{
    transform: scale(1.2);
  }
}


.sample-search-input {
  margin: 1em 0;
  position: relative;
  height: 3em;
  max-width: calc(100vw - 12em);
  border-radius: 6px;
  margin-right: 1em;
  border: solid 2px grey;

  .sample-search-input-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }


  .form-input {
    border: none;
    position: relative;
  }
}
</style>