<template>
  <centered-responsive-layout>
    <template v-slot:content>
      <div style="height:100vh;width:100%;">
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
                  class="circle user-icon"
                  :style="{ background: `center / contain no-repeat  url('${userIcon}')` }"
                  @click="onUserMenuClicked"
                />
              </div>
            </div>
          </div>
          <div class="sample-search-input-background" />
        </div>
        <scrolling-container
          :on-scroll-limit-reached="onScrollLimitReached"
        >
          <template v-slot:scrolling-content>
            <router-view />
          </template>
        </scrolling-container> 
      </div>
    </template>
  </centered-responsive-layout>
</template>

<script>
import { mapState } from 'vuex';
import FormInput from '@/components/form/FormInput.vue';
import BootlegListIcon from '@/components/form/BootlegListIcon.vue';
import BootlegGroupIcon from '@/components/form/BootlegGroupIcon.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import {SORT_TYPES} from '@/store/modules/sample';

// TODO should be configurable in the build
const SAMPLE_BUFFER_SIZE = 10;

export default {
  name: 'SamplePage',
  components: {
    CenteredResponsiveLayout,
    FormInput,
    BootlegListIcon,
    BootlegGroupIcon,
    ScrollingContainer,
  },
  data: () => ({
    samples: [],
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
            $router.push('landingPage');
          }
        }
      },
    } 
  }),

  computed: {
    ...mapState('user', ['userIcon', 'apiToken']),
    ...mapState('sample', ['sortType']),
    isListTypeSelected(){
      return this.sortType === SORT_TYPES.LIST;
    },
    isGroupTypeSelected(){
      return this.sortType === SORT_TYPES.GROUP;
    }
  },

  methods: {
    onScrollLimitReached(){
      const {apiToken:{accessToken: token}} = this;
      this.$store.dispatch('sample/loadMoreSamples', {token});
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
    async onFormDropdownChanged(value) {
      await this.$store.dispatch('dropdown/hideDropdown', {showLoading: false, opacity: '0'});
    },
    onSearchChanged(query) {
      const {apiToken:{accessToken: token}} = this;
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
  }
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
}

.sample-search-input-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(33, 35, 35);
  z-index: -2
}

.sample-search-input {
  margin: 1em 0;
  position: relative;
  height: 3em;
  max-width: calc(100vw - 12em);
  border-radius: 6px;
  margin-right: 1em;
  border: solid 2px grey;

  .form-input {
    border: none;
    position: relative;
  }
}

.sample-search-input-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.sort-icon {
  padding-right: 0.5em;
  font-size: 1.5em;
  justify-content: center;
  align-content: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.25s ease, color 0.25s ease;
  color: darkgray;

  &:hover {
    transform: scale(1.2);
    color: white;
  }

  &.selected {
    transform:scale(1.1);
    color:white;
  }
}
</style>