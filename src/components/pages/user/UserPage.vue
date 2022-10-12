<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <side-navigation />
    </template>
    <template v-slot:content>
      <div
        class="user-settings-content-container" 
        style="position:relative;display:flex;flex-direction: column;"
      >
        <Header />
        <scrolling-container style="flex:1;">
          <template v-slot:scrolling-content>
            <router-view />
          </template>
        </scrolling-container>
        <page-footer
          :menu-items="sideNavigationMenuOptions"
        />
      </div>
    </template>
  </centered-responsive-layout>
</template>

<script>
import {mapState, mapGetters}  from 'vuex';
import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import Header from '@/components/layout/Header.vue';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import PageFooter from '../../layout/PageFooter';

export default {
  name:'UserSettingsPage',
  components:{
    CenteredResponsiveLayout,
    Header,
    SideNavigation,
    ScrollingContainer,
    PageFooter
  },
  data:() => ({
    inputWidth: '10em',
    sideNavigationMenuOptions: [
      {title: 'Home', slug:'/sample', icon:'fa-house', id: 0},

      {
        icon: 'fa-gear',
        title: 'Settings',
        slug: '/user/settings',
        id: 0
      },
      {
        icon: 'fa-heart-music-camera-bolt',
        title: 'Library',
        slug: '/user/library',
        id: 1
      }
    ].map((o,id) => ({...o, id})),
    selectionIndex: 0,
  }),
  watch:{
    imageSrc(newImageSrc) {
      if(this.initialized && newImageSrc) {
        this.isDirty = true;
      }
    }
  },
  mounted(){
    this.$store.dispatch('app/setSideNavigationMenuItems', [...this.sideNavigationMenuOptions]);
  },
}
</script>

<style lang="scss">
.user-settings-user-menu-container {
  padding: 2em;
  display: flex;
  justify-content: flex-end;
}

.user-settings-image-upload-container {
  padding:2em;
}

.user-settings-form-container {
  width:100%;
  height:100%;
  display:flex;
  flex-direction: column;
}

.user-settings-image-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  height:100%;
}

.user-settings-content-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height:100vh;
  width:100%;

  .user-settings-content {
    color: white;
    overflow:hidden;
  }
}

.inset-panel {
  z-index: 1;
  border-radius: 8px;
  background: #272727;
  background-blend-mode: normal;
}
</style>