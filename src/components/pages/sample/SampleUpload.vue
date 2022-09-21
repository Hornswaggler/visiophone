<template>
  <div
    class="fill vp-form"
    style="color:#66FF00;"
  >
    <div class="user-settings-image-container">
      <image-editor
        class="flex-3"
        :img-src="imageSrc"
        :change-handler="onImageChanged"
      />
    </div>
    <div class="vp-form-row">
      <upload-file
        title="profile image"
        :accept="IMAGE_MIME_TYPE"
        button-text="Upload"
        :change-handler="onImageUpload"
      />
    </div>


    <div class="vp-form-row">
      <upload-file
        :accept="AUDIO_MIME_TYPE"
        button-text="Upload"
        class="flex-3"
        :change-handler="sampleInputChangeHandler"
      />
    </div>

    <div class="vp-form-row">
      <form-select 
        title="tag"
        :value="tag"
        class="flex-3"
      />
    </div>

    <div class="vp-form-row">
      <text-area-input
        :on-changed="onTextAreaInputChanged"
        :value="description"
        class="flex-3"
        title="description"
      />
    </div>

    <div class="vp-form-row">
      <div class="flex-3 flex justify-end">
        <button
          class="vp-button"
          type="button"
          @click="goBack"
        >
          Cancel
        </button>
        <button
          class="vp-button ml1"
          type="button"
          @click="handleSubmitForm"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import UploadFile from '@/components/form/UploadFile.vue';
import ImageEditor from '@/components/form/ImageEditor.vue';
import TextAreaInput from '@/components/form/TextAreaInput';
import { mapState, mapGetters } from 'vuex';
import FormSelect from '@/components/form/FormSelect.vue';
import {AUDIO_MIME_TYPE, IMAGE_MIME_TYPE} from '@/config';

const defaultSample = {
  description: '',
  tag: 'InfluencerCore'
};

export default {
  name: 'SampleUpload',
  data: () => ({
    ...defaultSample,
    AUDIO_MIME_TYPE,
    IMAGE_MIME_TYPE,
    resampledBlob: {},
    imageSrc: '',
    imageBlob:{}
  }),
  computed: {
    ...mapGetters('user',['idToken']),
    ...mapState('user',['authenticated','shelfCapacity']),
    model() {
      const {description, tag} = this;
      return {
        description,
        tag
      }
    }
  },
  components: {
    UploadFile,
    FormSelect,
    TextAreaInput,
    ImageEditor
  },
  mounted() {
    this.$store.commit('app/setSideNavigationIndex', 1);
  },
  methods: {
    onImageChanged(newImage) {
      Vue.set(this, 'resampledBlob', newImage);
    },
    onImageUpload(e){
      console.log('Image Upload');
      Vue.set(this.imageBlob, e.files[0]);
      this.imageSrc =  URL.createObjectURL(e.files[0]);
    },
    async handleSubmitForm() {
      try {
        this.$store.commit('app/isLoading', true);

        await this.$store.dispatch('sample/uploadBuffer', { 
          sampleData: this.model,
          token: this.idToken
        });

        Object.keys(defaultSample).map(key => {
          this[key] = defaultSample[key];
        });

        this.$router.push('/sample');
      } catch (e) {
        console.error(e);
      } finally {
        this.$store.commit('app/isLoading', false);
      }
    },
    sampleInputChangeHandler(el) {
      this.$store.dispatch('sample/setFileBuffer',el.files[0]);
    },
    goBack() {
      this.$router.push('/sample');
    },
    onTextAreaInputChanged(description) {
      console.log('text input changed');
      // this.description = description;
    }
  }
}
</script>
<style lang="scss">

</style>