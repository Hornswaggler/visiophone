<template>
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
          :change-handler="onImageSelected"
        />
      </div>
      <div class="flex-1" />
      <div class="vp-form-row flex"> 
        <div class="flex-1" />
        <button
          class="vp-button"
          type="button"
          @click="onSaveChanges"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import {mapGetters, mapState} from 'vuex';
import UploadFile from '@/components/form/UploadFile.vue';
import ImageEditor from '@/components/form/ImageEditor.vue';
import FormInput from '@/components/form/FormInput.vue';
import {IMAGE_MIME_TYPE} from '@/config';

export default {
  name:'UserSettings',
  components:{
    UploadFile,
    ImageEditor,
    FormInput
  },
  data: () => ({
    initialized: false,
    resampledBlob: {},
    imageBlob: {},
    internalUserName:'',
    imageSrc: '',
    profileImage:{},
    IMAGE_MIME_TYPE

  }),
  computed:{
    ...mapState('user',['customUserName']),
    ...mapGetters('user', ['profileImg', 'accountId']),

  },
  mounted(){
    this.$store.commit('app/setSideNavigationIndex', 0);
    this.internalUserName = this.customUserName;
    if(this.profileImage) {
      this.imageSrc = this.profileImg;
    }
    this.$nextTick(() => {
      this.initialized = true;
    });
  },
  methods:{
    onImageSelected(file){
      Vue.set(this.imageBlob, file);
      this.imageSrc =  URL.createObjectURL(file);
    },

    onImageChanged(newImage) {
      Vue.set(this, 'resampledBlob', newImage);
    },

    onUserNameChanged(userName){
      this.internalUserName = userName;
    },

    async onSaveChanges() {
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

  }
}
</script>

<style>

</style>