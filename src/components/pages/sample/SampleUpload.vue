<template>
  <scrolling-container>
    <template v-slot:scrolling-content>
      <div class="vp-form-row">
        <form-toggle-select
          :options="options"
          :on-changed="option => isSamplePack = option === 'Pack' "
        ></form-toggle-select>
      </div>
      <div class="sample-upload">
        <div 
          class="form-base pt05 flex-1" 
          :style="{backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`}"
        >
          <div
            v-for="(sample, key) in samplePack.sampleData"
            :key="key"
            class="add-sample-panel"
          >
            <!-- THIS IS THE DATA{{ sampleData }} -->
            <div class="form-column">
              <div class="vp-form-row">
                <form-input
                  :fieldName="`sampleData.${key}.name`"
                  :value="sample.name"
                  title="name"
                  :on-changed="name => sample.name = name"
                ></form-input>
              </div>
              
              <!-- <div class="vp-form-row">
                <form-upload-file
                  :value="sampleMetadata.imgUrl"
                  title="cover art"
                  fieldName="imgUrl"
                  :accept="IMAGE_MIME_TYPE"
                  button-text="Upload"
                  :change-handler="onImageUpload"
                />
              </div> -->
              
              <div class="vp-form-row mt0">
                <form-input
                  :fieldName="`sampleData.${key}.key`"
                  :value="sample.key"
                  title="key"
                  :on-changed="key => sample.key = key"
                ></form-input>
              </div>

              <div class="vp-form-row">
                <text-area-input
                  class="flex-3"
                  title="description"
                  :value="sample.description"
                  :fieldName="`sampleData.${key}.description`"
                  :on-changed="description => sample.description = description"
                />
              </div>
            </div>

            <div class="form-column">
              <div class="vp-form-row">
                <form-upload-file
                  title="audio file"
                  :fieldName="`sampleData.${key}.clipUri`"
                  :value="sample.clipUri"
                  :accept="AUDIO_MIME_TYPE"
                  button-text="Upload"
                  class="flex-3"
                  :change-handler="file => onSamplechanged(file, sample)"
                />
              </div>

              <div class="vp-form-row">
                <form-select
                  title="tag"
                  :fieldName="`sampleData.${key}.tag`"
                  :options="tags"
                  :value="sample.tag"
                  class="flex-3"
                  :on-changed="tag => sample.tag = tag"
                />
              </div>

              <div class="vp-form-row flex-column flex">
                <form-number-input
                  title="cost"
                  :fieldName="`sampleData.${key}.cost`"
                  :value="sample.cost"
                  :onChanged="cost => sample.cost = cost"
                />
              </div>

              <div class="vp-form-row">
                <form-number-input
                  title="bpm"
                  :fieldName="`sampleData.${key}.bpm`"
                  :value="sample.bpm"
                  :change-handler="bpm => sample.bpm = bpm"
                />
              </div>


            </div>

          </div>

          <!-- <div class="pl1 form-column">
            <div class="vp-form-row user-settings-image-container">
              <form-image-editor
                class="flex-3"
                :img-src="imageSrc"
                :change-handler="onThumbnailGenerated"
              />
            </div>
          </div> -->
        </div>

      </div>
      <div class="vp-form-row flex justify-end pb1">
        <button
            class="vp-button ml1"
            type="button"
            @click="addSample"
          >
            +
          </button>
      </div>
      <div class="vp-form-row flex-1">
        <div class=" flex justify-end fill-height align-end">
          <button
            class="vp-button ml1"
            type="button"
            @click="handleSubmitForm"
          >
            Upload
          </button>
        </div>
      </div>
      
      <!-- <compact
        v-model="colors"
      ></compact> -->
    </template>
  </scrolling-container>

</template>
<script>
import Vue from 'vue';
import FormUploadFile from '@/components/form/FormUploadFile.vue';
import FormImageEditor from '@/components/form/FormImageEditor.vue';
import TextAreaInput from '@/components/form/TextAreaInput.vue';
import FormNumberInput from '@/components/form/FormNumberInput.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import { mapState } from 'vuex';
import FormSelect from '@/components/form/FormSelect.vue';
import { AUDIO_MIME_TYPE, IMAGE_MIME_TYPE } from '@/config';
import { makeNewSample } from '@/store/modules/sample';
import FormInput from '@/components/form/FormInput.vue';
import FormToggleSelect from '../../form/FormToggleSelect.vue';
import { Photoshop, Compact } from 'vue-color';
import { v4 as uuidv4 } from 'uuid';

const TAG_TYPES = [
  { name: 'InfluencerCore'},
  { name: 'jazz' },
  { name: 'rnb' },
  { name: 'smooth influencercore' }
].map((type, i) => ({...type, _id: i }));

export default {
  name: 'SampleUpload',
  
  components: {
    FormUploadFile,
    FormSelect,
    TextAreaInput,
    FormImageEditor,
    FormNumberInput,
    ScrollingContainer,
    FormInput,
    Photoshop,
    Compact,
    FormToggleSelect
  },

  data: () => ({
    sampleMetadata: makeNewSample(),
    samplePack: {
      name: '',
      sampleData: {}
    },
    tags: [...TAG_TYPES],
    AUDIO_MIME_TYPE,
    IMAGE_MIME_TYPE,
    resampledBlob: {},
    imageSrc: '',
    imageBlob: {},
    sampleBlobs: {},
    description: '',
    colors: { r: 255, g: 0, b: 0 },
    isSamplePack: false,
    options: ['Single', 'Pack' ],
  }),

  computed: {
    ...mapState('user',['authenticated', 'customUserName']),
    ...mapState('sample', ['sampleForEdit']),
    rgba() {
      return this.colors.rgba || {r:0,g:0,b:0,a:0};
    },
    samplePackArray(){
      const result = Object.keys(this.samplePack).map(key => {
        return {...this.samplePack[key], key};
      });

      return result;
    }
  },

  async mounted() {
    this.addSample();
    this.$store.dispatch('form/initialize', {formName: 'sample'});
  },

  beforeDestroy(){
    this.$store.dispatch('sample/persistToStorage', this.sampleMetadata);
  },

  methods: {
    addSample() {
      const _tempId = uuidv4();
      Vue.set(this.samplePack.sampleData, uuidv4(), {
        _tempId,
        ...makeNewSample()
      });
    },
    onThumbnailGenerated(file) {
      Vue.set(this, 'imageBlob', file);
      Vue.set(this.sampleMetadata, 'imgUrl', URL.createObjectURL(file));
    },
    onImageUpload(file) {
      Vue.set(this.sampleMetadata, 'fileName',file.name)
      Vue.set(this.imageBlob, file);
      this.imageSrc = URL.createObjectURL(file);
    },
    onSamplechanged({clipUri, file}, sample) {
      sample.clipUri = clipUri;
      Vue.set(this.sampleBlobs, sample._tempId, file);
    },
    async handleSubmitForm() {
      if(await this.$store.dispatch('form/validateForm', {formData: this.samplePack})){
        try {
          this.$store.commit('app/isLoading', true);
          
          await this.$store.dispatch('sample/uploadSample', {
            sampleData: {...this.sampleMetadata},
            sample: this.sampleBlobs,
            image: this.imageBlob,
            imageSrc: this.imageSrc,
          });

          // await this.$store.dispatch('sample/uploadSamplePack',{
          //   name: 'New Sample Pack',
          //   samples: [{
          //     sampleData: {...this.sampleMetadata},
          //     sample: this.sampleBlobs,
          //     image: this.imageBlob,
          //     imageSrc: this.imageSrc,
          //   }]
          // });
          
          Vue.set(this.sampleMetadata, makeNewSample());

          this.$router.push('/search');
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
