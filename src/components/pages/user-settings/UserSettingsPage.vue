<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <div
        class="inset-panel"
        style="color: white;"
      >
        <div class="side-navigation-menu">
          <div class="logo-container pt1">
            <div class="animated-text">
              VISIOPHONE
            </div>
          </div>
          {{ menuOptions }}
          <div
            v-for="option in menuOptions"
            :key="option.id"
            class="side-naviagation-option"
            :class="{ selected: selectionIndex === option.id }"
            @click="onMenuOptionClicked(option.id)"
          >
            <font-awesome-icon 
              class="form-icon"
              style="font-size:0.5em;height:2em;"
              :icon="option.icon"
            />
            <div>{{ option.title }}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div style="flex:1; width:calc(100vw - 13em);position:relative;">
        <!-- <div class="flex selection-container">
          <span @click="onClickBack">
            <font-awesome-icon 
              class="form-icon"
              style="font-size:0.5em;height:2em;"
              icon="fa-angle-left"
            />
          </span>
          <span>
            <font-awesome-icon 
              class="form-icon pl1"
              style="font-size:0.5em;height:2em;"
              icon="fa-angle-right"
            />
          </span>
          <div style="display:flex;justify-content:flex-end;flex:1;height:100%;width: 100%;">
            <div style="height:2em;width:2em;background-color:grey">
              <img
                class="fill"
                :src="profileImg"
                @click="onUserMenuClicked"
              >
            </div>
          </div>
        </div> -->


        <Header />

        <div
          class="fill vp-form"
          style="
            color:#66FF00;
            overflow:hidden;
          "
        >
          <div
            class="vp-form-row"
            style="margin:0;"
          >
            <!-- TODO fix this  -->
            <div
              style="
              width: calc(100vw - 13em);
              height: calc(100vh - 3.2em);
              display:flex;
              flex-direction: column;"
            >
              <div
                style="
                height: 100%;
                display: flex;
                align-items: center;
                overflow: hidden;"
              >
                <image-editor
                  class="flex-3"
                  :img-src="imageSrc"
                  :change-handler="onImageChanged"
                />
              </div>
              <div style="padding:2em;">
                <UploadFile
                  title="profile image"
                  :accept="IMAGE_MIME_TYPE"
                  button-text="Upload"
                  :change-handler="onImageUpload"
                />
              </div>
              <div style="padding:2em; display:flex; justify-content: flex-end;"> 
                <button
                  class="vp-button"
                  type="button"
                  @click="handleUploadImage"
                >
                  Submit 
                </button>
              </div>
              <div style="width:100%;height:12em;" />
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

const result = Object.entries(DEFAULT_MENU).map(([key,value], id) => ({
  id,
  ...value,
}));

console.log(result);

export default {
  name:'UserSettingsPage',
  components:{
    UploadFile,
    CenteredResponsiveLayout,
    ImageEditor,
    Header
  },
  data:() => ({
    initialized:false,
    isDirty:false,
    inputWidth: '10em',
    imageBlob:{},
    IMAGE_MIME_TYPE,
    menuOptions:[
      {
        icon: 'fa-gear',
        title:'Settings'
      }
    ].map((o,id) => ({...o, id})),
    selectionIndex: 0,
    profileImage: {},
    imageSrc: '',
    resampledBlob: {},
    menuItems: Object.keys(DEFAULT_MENU).map((key,id) => ({id, ...DEFAULT_MENU[key]}))
  }),
  watch:{
    imageSrc(newImageSrc){
      if(this.initialized && newImageSrc){
        this.isDirty = true;
      }
    }
  },
  computed:{
    ...mapGetters('user', ['profileImg']),
    ...mapState('user', ['accountId', 'userIcon']),
    profileUrl() {
      return this.profileImage ? '' : URL.createObjectURL(this.profileImage);
    }
  },
  mounted(){
    if(this.profileImage)
      this.imageSrc = this.profileImg;
      this.$nextTick(() => {
        this.initialized = true;
      });
  },
  methods:{
    async onFormDropdownChanged(value) {
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
    async handleUploadImage(){
      this.$store.commit('app/isLoading', true);

      const result = await this.$store.dispatch(
        'user/uploadUserProfile',
        { 
          blob: this.resampledBlob,
        }
      );
    },

    onImageUpload(e){
      Vue.set(this.imageBlob, e.files[0]);
      this.imageSrc =  URL.createObjectURL(e.files[0]);
    },

    onMenuOptionClicked(id){
      // if(this.selectionIndex != id) this.selectionIndex = id;
    }
  }
}
</script>

<style lang="scss">
.selection-container {
  background-color: rgb(31 25 25 / 77%);
  color: #ffffffa1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1em;
  font-size: 1.2em;
  z-index: 1;


  & > * {
    cursor: pointer;
    transition: color 0.2s ease-out;

    &:hover{
      color:white;
    }
  }

}

.inset-panel {
  z-index: 1;
  border-radius: 8px;
  background: #272727;
  background-blend-mode: normal;
}

.logo-container {
  display:flex;
  justify-content: center;
  width:100%;

  .animated-text {
    font-size: 1.2em;
    background: linear-gradient(180deg, #2cd8d5 0%, #9fafd3 50%, #5a2288 100%);
    animation: animated_text 10s ease infinite;
    background-size: 300%;

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Inter;
    font-weight: 800;
    letter-spacing: 0.2em;

  }
}

@keyframes animated_text {
	0% { background-position: 0px 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0px 50%; }
}

.side-navigation-menu {
  box-shadow: 0px 4em 4em rgba(100,100,100,0.4);

  height:100%;
  width:13em;
  display:flex;
  align-items: flex-end;
  flex-direction: column;

  .side-naviagation-option {
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    max-height:2em;
    min-height:2em;
    width:75%;
    display: flex;
    justify-content: space-evenly;
    margin-top: 1em;
    transition: all 0.18s linear;
    cursor:pointer;

    &:not(.selected){
      &:hover{
        background-color: white;
        color: black;
      }
    }

    &.selected{
      background: linear-gradient(to  top, rgba(75, 75, 75, 0.503), rgba(196, 196, 196, 0.756));
    }
  }
}
</style>