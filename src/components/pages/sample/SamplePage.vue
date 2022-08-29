<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <side-navigation />
    </template>
    <template v-slot:content>
      <div style="height:100vh;width:100%;">
        <Header />
        <!-- <div class="sample-search-input">
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
        </div> -->
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
import { mapState, mapGetters } from 'vuex';
import BootlegListIcon from '@/components/form/BootlegListIcon.vue';
import BootlegGroupIcon from '@/components/form/BootlegGroupIcon.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import Header from '@/components/layout/Header.vue';

// TODO should be configurable in the build
const SAMPLE_BUFFER_SIZE = 10;

export default {
  name: 'SamplePage',
  components: {
    CenteredResponsiveLayout,
    // FormInput,
    BootlegListIcon,
    BootlegGroupIcon,
    ScrollingContainer,
    SideNavigation,
    Header
},
  data: () => ({
    samples: [],
    inputWidth: '10em',
    menuItems: {
      settings:{
        displayName: 'Settings',
        handler: async({$router, $store}) => {
          await $store.dispatch('app/hideOverlay');
          console.log('Settings Handler Fired!');
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
      },
    } 
  }),

  computed: {
    ...mapState('user', ['userIcon', 'apiToken']),
    ...mapState('sample', ['sortType']),
    ...mapGetters('user', ['idToken']),


  },

  methods: {
    onScrollLimitReached(){
      const {idToken:token} = this;
      this.$store.dispatch('sample/loadMoreSamples', {token});
    },

    async onFormDropdownChanged(value) {
      await this.$store.dispatch('dropdown/hideDropdown', {showLoading: false, opacity: '0'});
    },

  }
}
</script>

<style lang="scss">

.sample-search-input-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(33, 35, 35);
  z-index: -2
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