<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <side-navigation />
    </template>
    <template v-slot:content>
      <div
        class="sample-page-body"
      >
        <Header />
        <scrolling-container :on-scroll-limit-reached="onScrollLimitReached">
          <template v-slot:header>
            <div
              v-if="isBrowsing && !isMobile"
              style="height:2em;padding: 0 0.5em"
              class="flex justify-end"
            >
              <bootleg-list-icon
                :on-click="onViewListClicked"
                :selected="isListTypeSelected"
              />
              <bootleg-group-icon 
                :on-click="onViewGroupClicked"
                :selected="isGroupTypeSelected"
              />
            </div>
          </template>
          <template v-slot:scrolling-content>
            <router-view />
          </template>
        </scrolling-container> 
      </div>
    </template>
  </centered-responsive-layout>
</template>

<script>
import {SORT_TYPES} from '@/store/modules/sample';
import { mapGetters, mapState } from 'vuex';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import Header from '@/components/layout/Header.vue';
import BootlegGroupIcon from '../../form/BootlegGroupIcon.vue';
import BootlegListIcon from '../../form/BootlegListIcon.vue';

export default {
  name: 'SamplePage',
  components: {
    CenteredResponsiveLayout,
    ScrollingContainer,
    SideNavigation,
    Header,
    BootlegGroupIcon,
    BootlegListIcon
  },
  data: () => ({
    menuItems: [
      {title: 'Browse', slug:'/sample', icon:'fa-gear', id: 0},
      {title: 'Upload', slug:'/sample/upload', icon:'fa-gear', id: 1},
    ]
  }),
  
  computed: {
    ...mapState('app', ['sideNavigationMenuItems', 'sideNavigationIndex', 'isMobile']),
    ...mapGetters('app', ['sideNavigationMenuItemById']),
    ...mapGetters('user', ['idToken']),
    isBrowsing(){
      const {title = ''} = this.selectedMenuItem || '';
      return title  === 'Browse'
    },
    isListTypeSelected(){
      return this.sortType === SORT_TYPES.LIST;
    },
    isGroupTypeSelected(){
      return this.sortType === SORT_TYPES.GROUP;
    },
    selectedMenuItem(){
      return this.sideNavigationMenuItemById[`${this.sideNavigationIndex}`];
    }
  },

  mounted(){
    this.$store.dispatch('app/setSideNavigationMenuItems', [...this.menuItems]);
    if(this.isMobile){
      this.onViewGroupClicked();
    }
  },

  methods: {
    onScrollLimitReached(){
      const {idToken:token} = this;
      this.$store.dispatch('sample/loadMoreSamples', {token});
    },

    onViewGroupClicked(){
      if(!this.isGroupTypeSelected){
        this.$store.dispatch('sample/setSortType', SORT_TYPES.GROUP);
      }
    },
    
    onViewListClicked(){
      if(!this.isListTypeSelected){
        this.$store.dispatch('sample/setSortType', SORT_TYPES.LIST);
      }
    },
  }
} 
</script>

<style lang="scss">

.sample-page-body{
  box-shadow: 20px 20px 30px 0px rgba(0,0,0,0.75);
  height:100vh;
  width:100%;
  background-color:rgba(0,0,0, 0.5);
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

.sample-search-input-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.sort-icon {
  padding-left: 0.5em;
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