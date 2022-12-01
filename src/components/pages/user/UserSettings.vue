<template>
  <div
    class="user-settings-form"
  >
    <!-- TODO fix this  -->
    <div class="vp-form">
      <div class="vp-form-row">
        <upload-file
          title="profile pic"
          :accept="IMAGE_MIME_TYPE"
          button-text="Upload"
          :change-handler="onImageSelected"
        />
      </div>
      <div 
        v-if="!isAuthorizedSeller"
        class="vp-form-row"
      >
        <form-input-base>
          <template v-slot:title>
            Account Type
          </template>
          <template
            v-slot:input
            style="height:initial;" 
          >
            <div style="width:100%;">
              <span style="padding:1em;text-align:left;font-size:0.8em;display:inline-block;">
                You have a <span style="color: var(--vp-highlight-color); display: inline-block;">buyer's</span> 
                account. With this account, you can purchase samples 
                from Visiophone sellers but you cannot upload your samples. 
                Upgrade to a seller's account to put your creations up for sale.
              </span>
              <button
                style="width:100%;"
                class="vp-button"
                type="button"
                @click="onUpgradeToSeller"
              >
                Upgrade
              </button>
            </div>
          </template>
        </form-input-base>
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
    <div class="vp-form">
      <div class="vp-form-row">
        <image-editor
          class="flex-3"
          :img-src="imageSrc"
          :change-handler="onImageChanged"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import FormInputBase from '../../form/FormInputBase.vue';
import UploadFile from '@/components/form/UploadFile.vue';
import ImageEditor from '@/components/form/ImageEditor.vue';
import FormInput from '@/components/form/FormInput.vue';
import { IMAGE_MIME_TYPE } from '@/config';

export default {
  name:'UserSettings',
  components:{
    UploadFile,
    ImageEditor,
    FormInput,
    FormInputBase
  },
  data: () => ({
    initialized: false,
    resampledBlob: {},
    imageBlob: {},
    imageSrc: '',
    profileImage:{},
    IMAGE_MIME_TYPE

  }),
  computed:{
    ...mapState('user',['customUserName', 'isAuthorizedSeller', 'profileImg']),
  },
  mounted(){
    this.imageSrc = this.profileImg;
    this.$nextTick(() => {
      this.initialized = true;
    });
  },
  methods:{
    onUpgradeToSeller(){
      this.$store.dispatch('user/upgradeToSellerAccount');
    },
    onImageSelected(file){
      Vue.set(this.imageBlob, file);
      this.imageSrc =  URL.createObjectURL(file);
    },

    onImageChanged(newImage) {
      Vue.set(this, 'resampledBlob', newImage);
    },
    
    async onSaveChanges() {
      this.$store.commit('app/isLoading', true);

      const result = await this.$store.dispatch(
        'user/uploadUserProfile', {
          blob: this.resampledBlob,
        }
      );

      this.$router.push('/sample');
    },

  }
}
</script>

<style lang="scss">

.user-settings-form {
  display:flex;
  &>*{
    flex:1;
  }
}

</style>