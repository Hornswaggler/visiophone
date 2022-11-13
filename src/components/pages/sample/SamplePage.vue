<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <side-navigation
        :change-handler="onSideNavigationChanged"
      />
    </template>
    <template v-slot:content>
      <div
        class="sample-page-body"
      >
        <Header />
        <router-view />
        <page-footer
          :menu-items="menuItems"
        />
      </div>
    </template>
  </centered-responsive-layout>
</template>

<script>
import {SORT_TYPES} from '@/store/modules/sample';
import { mapGetters, mapState } from 'vuex';
import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import Header from '@/components/layout/Header.vue';
import PageFooter from '../../layout/PageFooter';


//TODO refactor the menu items up a level, to the template
export default {
  name: 'SamplePage',
  components: {
    CenteredResponsiveLayout,
    SideNavigation,
    Header,
    PageFooter
  },
  data: () => ({
    menuItems: [
      {
        title: 'Browse',
        slug:'/sample',
        icon:'fa-house',
        id: 0
      },
      {
        icon: 'fa-heart-music-camera-bolt',
        title: 'Library',
        slug: '/user/library',
        id: 1
      },
      {

        title: 'Upload',
        slug:'/sample/upload',
        icon:'fa-cloud-arrow-up',
        id: 2
      },
      {
        icon: 'fa-gear',
        title: 'Settings',
        slug: '/user/settings',
        id: 3
      },

    ]
  }),
  
  computed: {
    ...mapState('app', ['sideNavigationMenuItems', 'sideNavigationIndex', 'isMobile']),
    ...mapGetters('app', ['sideNavigationMenuItemById']),
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
  },

  methods: {
    onSideNavigationChanged(){
      this.$store.commit('app/setShowMenu', false);
    },

  }
} 
</script>

<style lang="scss">

.sample-page-body {
  position:relative;
  display:flex;
  flex-direction:column;
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