<template>
  <scrolling-container>
    <template v-slot:scrolling-content>
      <div class="form-base">
        <div class="vp-form">
          <div class="vp-form-row mt0">
            <form-input
              fieldName="name"
              :value="sampleData.name"
              title="name"
              :onChanged="name => sampleData.name = name"
            ></form-input>
          </div>
          <div class="vp-form-row">
            <upload-file
              :value="sampleData.imgUrl"
              title="cover art"
              fieldName="imgUrl"
              :accept="IMAGE_MIME_TYPE"
              button-text="Upload"
              :change-handler="onImageUpload"
            />
          </div>

          <div class="vp-form-row">
            <upload-file
              title="audio file"
              fieldName="clipUri"
              :value="sampleData.clipUri"
              :accept="AUDIO_MIME_TYPE"
              button-text="Upload"
              class="flex-3"
              :change-handler="onSamplechanged"
            />
          </div>

          <div class="vp-form-row">
            <form-select
              title="tag"
              fieldName="tag"
              :options="tags"
              :value="sampleData.tag"
              class="flex-3"
              :change-handler="onTagChanged"
            />
          </div>

          <div
            class="vp-form-row flex-column flex"
          >
            <div class="vp-input-body">
              <form-number-input
                title="cost"
                fieldName="cost"
                :value="sampleData.cost"
                :change-handler="cost => sampleData.cost = cost"
              />
            </div>
          </div>

          <div class="vp-form-row">
            <div class="vp-input-body">
              <form-number-input
                title="bpm"
                fieldName="bpm"
                :value="sampleData.bpm"
                :change-handler="bpm => sampleData.bpm = bpm"
              />
            </div>
          </div>

          <div class="vp-form-row">
            <text-area-input
              class="flex-3"
              title="description"
              :value="description"
              fieldName="description"
              :on-changed="description => sampleData.description = description"
            />
          </div>
        </div>

        <div class="pl1 flex-1">
          <div class="user-settings-image-container">
            <image-editor
              class="flex-3"
              :img-src="imageSrc"
              :change-handler="onThumbnailGenerated"
            />
          </div>
        </div>
      </div>
      <div class="vp-form-row pt2">
        <div class="flex-3 flex justify-end">
          <button
            class="vp-button ml1"
            type="button"
            @click="handleSubmitForm"
          >
            Upload
          </button>
        </div>
      </div>
    </template>
  </scrolling-container>
</template>
<script>
import Vue from 'vue';
import UploadFile from '@/components/form/UploadFile.vue';
import ImageEditor from '@/components/form/ImageEditor.vue';
import TextAreaInput from '@/components/form/TextAreaInput.vue';
import FormNumberInput from '@/components/form/FormNumberInput.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import { mapState } from 'vuex';
import FormSelect from '@/components/form/FormSelect.vue';
import { AUDIO_MIME_TYPE, IMAGE_MIME_TYPE } from '@/config';
import { makeNewSample } from '@/store/modules/sample'
import FormInput from '@/components/form/FormInput.vue';

const TAG_TYPES = [
  { name: 'InfluencerCore'},
  { name: 'jazz' },
  { name: 'rnb' },
  { name: 'smooth influencercore' }
].map((type, i) => ({...type, _id: i }));

export default {
  name: 'SampleUpload',
  data: () => ({
    sampleData: makeNewSample(),
    tags: [...TAG_TYPES],
    AUDIO_MIME_TYPE,
    IMAGE_MIME_TYPE,
    resampledBlob: {},
    imageSrc: '',
    imageBlob:{},
    sampleBlob:{},
    description:'',
  }),
  computed: {
    ...mapState('user',['authenticated', 'customUserName']),
    ...mapState('sample', ['sampleForEdit']),

  },
  components: {
    UploadFile,
    FormSelect,
    TextAreaInput,
    ImageEditor,
    FormNumberInput,
    ScrollingContainer,
    FormInput,
  },
  async mounted(){
    Vue.set(this.sampleData, this.sampleForEdit);

    await this.$store.dispatch('form/getForm', {formName: 'sample'});
    this.description = this.sampleData.description;

    this.$store.dispatch('form/initialize', {model: this.sampleData, formName: 'sample'})
  },
  beforeDestroy(){
    this.$store.dispatch('sample/persistToStorage', this.sampleData);
  },
  methods: {
    onThumbnailGenerated(file) {
      Vue.set(this, 'imageBlob', file);
      Vue.set(this.sampleData, 'imgUrl', URL.createObjectURL(file));
    },
    onImageUpload(file) {
      Vue.set(this.sampleData, 'fileName',file.name)
      Vue.set(this.imageBlob, file);
      this.imageSrc =  URL.createObjectURL(file);
    },
    onSamplechanged(file) {
      Vue.set(this, 'sampleBlob', file);
      Vue.set(this.sampleData, 'clipUri', URL.createObjectURL(file));
    },
    onTagChanged(newTag){
      Vue.set(this.sampleData, 'tag', newTag)
    },
    async handleSubmitForm() {
      if(await this.$store.dispatch('form/validateForm')){
        try {
          this.$store.commit('app/isLoading', true);

          await this.$store.dispatch('sample/uploadSample', {
            sampleData: {...this.sampleData},
            sample: this.sampleBlob,
            image: this.imageBlob,
            imageSrc: this.imageSrc,
          });

          Vue.set(this.sampleData, makeNewSample());

          this.$router.push('/sample');
        } catch (e) {
          console.error(e);
        } finally {
          this.$store.commit('app/isLoading', false);
        }
      }
    },
  }
}
</script>