<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <div
        class="inset-panel"
        style="color:white;"
      >
        <!-- <SiteLogo /> -->
        <div class="side-navigation-menu">
          <div class="logo-container pt1">
            <div
              class="tesetsetset"
            >
              VISIOPHONE
            </div>
          </div>
          <div
            v-for="option in menuOptions"
            :key="option.id"
            class="side-naviagation-option"
            :class="{selected: selectionIndex === option.id}"
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
      <div style="flex:1;">
        <div
          class="fill vp-form"
          style="color:#66FF00;"
        >
          <div style="padding: 0 2em;">
            <div
              class="vp-form-row"
            >
              <div style="width:calc(100vw - 13em);height: 100vh; display:flex;">
                <img
                  ref="imageEl"
                >
                <UploadFile
                  :accept="IMAGE_MIME_TYPE"
                  button-text="Upload"
                  class="flex-3"
                  :change-handler="onImageChanged"
                />
                <button  
                  class="vp-button ml1"
                  type="button"
                  @click="handleUploadImage"
                />
              </div>

              

           

              <!-- <div style="border: solid white 1px;width:100%;">
                <form-input />
              </div> -->
              <!-- <cropper
                class="cropper"
                :src="require('@/assets/Visioland_text.png')"
                :stencil-props="{
                  aspectRatio: 1
                }"
                style="width:100%;width:100%;"
                @change="change"
              /> -->
            </div>
            <!-- <div class="vp-form-row">
              <text-area-input class="fill" />
            </div> -->
          </div>
        </div>
      </div>
    </template>
  </centered-responsive-layout>
</template>

<script>
import Vue from 'vue';

import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import UploadFile from '@/components/form/UploadFile.vue';
import { Cropper } from 'vue-advanced-cropper'

// import FormIcon from '@/components/form/FormIcon.vue';
// import SideNavigation from '@/components/layout/SideNavigation.vue';
import SiteLogo from '@/components/layout/SiteLogo.vue';
import FormInput from '../../form/FormInput.vue';
import TextAreaInput from '@/components/form/TextAreaInput.vue';
import {IMAGE_MIME_TYPE} from '@/config';

console.log('MIME',IMAGE_MIME_TYPE);

export default {
  name:'UserSettingsPage',
  data:() => ({
    IMAGE_MIME_TYPE,
    menuOptions:[
      {
        icon: 'fa-gear',
        title:'Settings'
      }
    ].map((o,id) => ({...o, id})),
    selectionIndex: 0,
    profileImage: {}
  }),
  computed:{
    profileUrl(){
      console.log('Calculating url');
      return this.profileImage ? '' : URL.createObjectURL(this.profileImage);
    }
  },
  components:{
    // SideNavigation,
    // FormIcon,
    UploadFile,
    CenteredResponsiveLayout,
    SiteLogo,
    FormInput,
    TextAreaInput,
    Cropper
  },
  mounted(){
    const sprite = new Image();
    // this.$refs.profileImage.src = 

    // sprite.src = require(`@/assets/${TILESET[key].path}`);
  },
  methods:{
    handleUploadImage(){
      console.log('asdfasdf');
      this.$store.commit('app/isLoading', true);
    },
    onImageChanged(e){
      console.log('The image changed!', e.files[0]);
      // Vue.set(this, 'profileImage',);
      this.$refs['imageEl'].src =  URL.createObjectURL(e.files[0]);
      
      // this.profileImage = 

    },
    onMenuOptionClicked(id){
      if(this.selectionIndex != id) this.selectionIndex = id;
    },
    change({coordinates, canvas}) {
      console.log(coordinates, canvas)
    }
  }
}
</script>

<style lang="scss">

.inset-panel {
  border-radius: 8px;
  background: #272727;
  background-blend-mode: normal;
}

.cropper {
  height: 600px;
  background: #DDD;
}

.logo-container {
  // background-color:black;
  display:flex;
  justify-content: center;
  width:100%;

  .tesetsetset {
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
  // background-color:black;
  // opacity: 0.78;
  width:13em;
  display:flex;
  align-items: flex-end;
  flex-direction: column;

  .side-naviagation-option{
    display: flex;
    align-items: center;
    // background-color: black;
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
      // background-color: grey;
      background: linear-gradient(to  top, rgba(75, 75, 75, 0.503), rgba(196, 196, 196, 0.756));
    }
  }
}
</style>