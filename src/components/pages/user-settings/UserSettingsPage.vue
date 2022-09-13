<template>
  <centered-responsive-layout>
    <template v-slot:side-panel>
      <div
        class="inset-panel"
        style="color:white;"
      >
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
      <div style="flex:1; width:calc(100vw - 13em)">
        <div
          class="fill vp-form"
          style="color:#66FF00;"
        >
          <div>
            <div
              class="vp-form-row"
            >
              <!-- TODO fix this  -->
              <div style="width:calc(100vw - 13em);height: 100vh; display:flex;flex-direction: column;">
                <image-editor
                  :img-src="imageSrc"
                />
                <div class="flex-3">
                  <UploadFile
                    :accept="IMAGE_MIME_TYPE"
                    button-text="Upload"
                    :change-handler="onImageChanged"
                  />
                  <button
                    class="vp-button ml1"
                    type="button"
                    @click="handleUploadImage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </centered-responsive-layout>
</template>

<script>
import CenteredResponsiveLayout from '@/components/layout/CenteredResponsiveLayout.vue';
import UploadFile from '@/components/form/UploadFile.vue';
import ImageEditor from '../../form/ImageEditor.vue';
import {IMAGE_MIME_TYPE} from '@/config';
import { debounce } from 'vue-debounce'

export default {
  name:'UserSettingsPage',
  components:{
    UploadFile,
    CenteredResponsiveLayout,
    ImageEditor
  },
  data:() => ({
    IMAGE_MIME_TYPE,
    debounce: debounce((callback, val) => callback && callback(val), 50),
    menuOptions:[
      {
        icon: 'fa-gear',
        title:'Settings'
      }
    ].map((o,id) => ({...o, id})),
    selectionIndex: 0,
    profileImage: {},
    imageWidth: 0,
    imageSrc: 'https://cdn3.photoblogstop.com/wp-content/uploads/2012/07/Sierra_HDR_Panorama_DFX8048_2280x819_Q40_wm_mini.jpg',
    offsetX:0
  }),
  computed:{
    profileUrl(){
      return this.profileImage ? '' : URL.createObjectURL(this.profileImage);
    }
  },
  methods:{
    handleScrollXDebounce(evt){
      this.offsetX = evt.target.scrollLeft;
    },
    handleUploadImage(){
      this.$store.commit('app/isLoading', true);
    },
    onImageChanged(e){
      this.$refs['imageEl'].src =  URL.createObjectURL(e.files[0]);
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
  z-index: 1;
  border-radius: 8px;
  background: #272727;
  background-blend-mode: normal;
}

.logo-container {
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
  width:13em;
  display:flex;
  align-items: flex-end;
  flex-direction: column;

  .side-naviagation-option{
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