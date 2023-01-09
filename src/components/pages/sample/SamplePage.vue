<template>
  <responsive-layout>
    <template v-slot:side-panel>
      <side-navigation
        :change-handler="onSideNavigationChanged"
      />
    </template>
    <template v-slot:content>
      <div class="sample-page-body">
        <Header/>
        <router-view />
        <page-footer
          :menu-items="menuItems"
        />
      </div>
    </template>
  </responsive-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import Header from '@/components/layout/Header.vue';
import PageFooter from '../../layout/PageFooter.vue';


//TODO refactor the menu items up a level, to the template
export default {
  name: 'SamplePage',
  components: {
    ResponsiveLayout,
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
    ...mapState('app', ['sideNavigationIndex']),
    ...mapGetters('app', ['sideNavigationMenuItemById']),
    selectedMenuItem(){
      return this.sideNavigationMenuItemById[`${this.sideNavigationIndex}`];
    }
  },

  methods: {
    onSideNavigationChanged(){
      this.$store.commit('app/setShowMenu', false);
    },
  }
} 
</script>
