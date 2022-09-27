<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <side-navigation />
    </template>
    <template v-slot:content>
      <div
        class="user-settings-content-container" 
        style="position:relative;"
      >
        <Header />
        <div class="fill">
          <div
            class="flex"
            style="margin:0;"
          >
            <!-- TODO fix this  -->
            <div class="vp-form p1 flex-1">
              <div class="vp-form-row">
                <image-editor
                  class="flex-3"
                  :img-src="imageSrc"
                  :change-handler="onImageChanged"
                />
              </div>
            </div>
            <div class="vp-form p1 flex-1">
              <div class="vp-form-row">
                <form-input
                  style="border: solid 1px #767676;"
                  title="user name"
                  :initial-value="customUserName"
                  :on-changed="onUserNameChanged"
                />
              </div>
              <div class="vp-form-row">
                <upload-file
                  title="profile pic"
                  :accept="IMAGE_MIME_TYPE"
                  button-text="Upload"
                  :change-handler="onImageUpload"
                />
              </div>
              <div class="flex-1" />
              <div class="vp-form-row flex"> 
                <div class="flex-1" />
                <button
                  class="vp-button"
                  type="button"
                  @click="handleUploadImage"
                >
                  Save Changes 
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </centered-responsive-layout>
</template>

<script>
import Vue from 'vue';
import {mapState, mapGetters}  from 'vuex';
import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import UploadFile from '@/components/form/UploadFile.vue';
import ImageEditor from '../../form/ImageEditor.vue';
import Header from '../../layout/Header.vue';
import {IMAGE_MIME_TYPE} from '@/config';
import SideNavigation from '@/components/layout/SideNavigation.vue';
import FormInput from '../../form/FormInput.vue';

const DEFAULT_MENU = {
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

  settings: {
    displayName: 'Settings',
    handler: async({$router, $store}) => {
      await $store.dispatch('app/hideOverlay');
      $router.push('user-settings');
    }
  },

  logout: {
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

export default {
  name:'UserSettingsPage',
  components:{
    UploadFile,
    CenteredResponsiveLayout,
    ImageEditor,
    Header,
    SideNavigation,
    FormInput
  },
  data:() => ({
    initialized: false,
    isDirty: false,
    inputWidth: '10em',
    imageBlob: {},
    IMAGE_MIME_TYPE,
    sideNavigationMenuOptions: [{
      icon: 'fa-gear',
      title: 'Settings',
      slug: '/sample/upload',
      id: 0
    }].map((o,id) => ({...o, id})),
    selectionIndex: 0,
    profileImage: {},
    imageSrc: '',
    resampledBlob: {},
    menuItems: Object.keys(DEFAULT_MENU).map((key,id) => ({id, ...DEFAULT_MENU[key]})),
    internalUserName:''
  }),
  watch:{
    imageSrc(newImageSrc) {
      if(this.initialized && newImageSrc) {
        this.isDirty = true;
      }
    }
  },
  computed:{
    ...mapGetters('user', ['profileImg']),
    ...mapState('user', ['accountId', 'userIcon', 'userName', 'customUserName']),
    profileUrl() {
      return this.profileImage ? '' : URL.createObjectURL(this.profileImage);
    }
  },
  mounted(){
    this.$store.dispatch('app/setSideNavigationMenuItems', [...this.sideNavigationMenuOptions]);
    this.$store.commit('app/setSideNavigationIndex', 0);
    this.internalUserName = this.customUserName;
    if(this.profileImage)
      this.imageSrc = this.profileImg;
      this.$nextTick(() => {
        this.initialized = true;
      });
  },
  methods:{
    onUserNameChanged(userName){
      this.internalUserName = userName;
    },
    async onFormDropdownChanged() {
      await this.$store.dispatch('dropdown/hideDropdown', {showLoading: false, opacity: '0'});
    },
    async onUserMenuClicked(e) {
      const { clientX = 0, clientY = 0 } = e;

      await this.$store.dispatch('dropdown/showDropdown', {
        clientX: `calc(${clientX}px - ${this.inputWidth})`,
        clientY: `${clientY}px`,
        menuItems: this.menuItems,
        onChanged: this.onFormDropdownChanged
      }),

      this.$nextTick(() => {
        this.$store.commit('dropdown/setItemWidth', this.inputWidth);
      });

      this.$store.dispatch('app/showOverlay', { showLoading: false, opacity: '0.9' });
    },
    onImageChanged(newImage) {
      Vue.set(this, 'resampledBlob', newImage);
    },
    onClickBack(){
      this.$router.go(-1);
    },
    async handleUploadImage() {
      this.$store.commit('app/isLoading', true);

      const result = await this.$store.dispatch(
        'user/uploadUserProfile', {
          blob: this.resampledBlob,
          accountId: this.accountId,
          customUserName: this.internalUserName
        }
      );

      this.$router.push('/sample');
    },

    onImageUpload(file){
      Vue.set(this.imageBlob, file);
      this.imageSrc =  URL.createObjectURL(file);
    },
  }
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
  height:100vh;
  width:100%;
  position:relative;

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