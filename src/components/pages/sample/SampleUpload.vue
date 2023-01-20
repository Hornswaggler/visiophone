<template>

  <scrolling-container class="sample-upload">
    <template v-slot:scrolling-content>
      <div class="vp-form-row">
        <form-toggle-select
          :options="options"
          :on-changed="option => isSamplePack = option === 'Pack' "
        ></form-toggle-select>
      </div> 
      <div 
        class="form-base pt05" 
        :style="{backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`}"
      >
        <div class="form-column">
          <div class="vp-form-row">
            <form-input
              fieldName="name"
              :value="sampleMetadata.name"
              title="name"
              :onChanged="name => sampleMetadata.name = name"
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
              fieldName="key"
              :value="sampleMetadata.key"
              title="key"
              :onChanged="key => sampleMetadata.key = key"
            ></form-input>
          </div>

          <div class="vp-form-row">
            <text-area-input
              class="flex-3"
              title="description"
              :value="description"
              fieldName="description"
              :on-changed="description => sampleMetadata.description = description"
            />
          </div>
        </div>

        <div class="form-column">

          <div class="vp-form-row">
            <form-upload-file
              title="audio file"
              fieldName="clipUri"
              :value="sampleMetadata.clipUri"
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
              :value="sampleMetadata.tag"
              class="flex-3"
              :change-handler="onTagChanged"
            />
          </div>

          
          <div
            class="vp-form-row flex-column flex"
          >
            <form-number-input
              title="cost"
              fieldName="cost"
              :value="sampleMetadata.cost"
              :change-handler="cost => sampleMetadata.cost = cost"
            />
          </div>

          <div class="vp-form-row">
            <form-number-input
              title="bpm"
              fieldName="bpm"
              :value="sampleMetadata.bpm"
              :change-handler="bpm => sampleMetadata.bpm = bpm"
            />
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
      <div class="vp-form-row">
        <div class=" flex justify-end">
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
import { makeNewSample } from '@/store/modules/sample'
import FormInput from '@/components/form/FormInput.vue';
import FormToggleSelect from '../../form/FormToggleSelect.vue';
import { Photoshop, Compact } from 'vue-color'

const TAG_TYPES = [
  { name: 'InfluencerCore'},
  { name: 'jazz' },
  { name: 'rnb' },
  { name: 'smooth influencercore' }
].map((type, i) => ({...type, _id: i }));

export default {
  name: 'SampleUpload',
  data: () => ({
    sampleMetadata: makeNewSample(),
    tags: [...TAG_TYPES],
    AUDIO_MIME_TYPE,
    IMAGE_MIME_TYPE,
    resampledBlob: {},
    imageSrc: '',
    imageBlob:{},
    sampleBlob:{},
    description:'',
    colors: { r: 255, g: 0, b: 0 },
    isSamplePack: false,
    options: ['Single', 'Pack' ],
  }),
  computed: {
    ...mapState('user',['authenticated', 'customUserName']),
    ...mapState('sample', ['sampleForEdit']),
    rgba(){
      return this.colors.rgba || {r:0,g:0,b:0,a:0};
    }
  },
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
  async mounted(){
    await this.$store.dispatch('form/getForm', {formName: 'sample'});
    this.description = this.sampleMetadata.description;

    this.$store.dispatch('form/initialize', {model: this.sampleMetadata, formName: 'sample'})
  },
  beforeDestroy(){
    this.$store.dispatch('sample/persistToStorage', this.sampleMetadata);
  },
  methods: {
    onThumbnailGenerated(file) {
      Vue.set(this, 'imageBlob', file);
      Vue.set(this.sampleMetadata, 'imgUrl', URL.createObjectURL(file));
    },
    onImageUpload(file) {
      Vue.set(this.sampleMetadata, 'fileName',file.name)
      Vue.set(this.imageBlob, file);
      this.imageSrc =  URL.createObjectURL(file);
    },
    onSamplechanged(file) {
      Vue.set(this, 'sampleBlob', file);
      Vue.set(this.sampleMetadata, 'clipUri', URL.createObjectURL(file));
    },
    onTagChanged(newTag){
      Vue.set(this.sampleMetadata, 'tag', newTag)
    },
    onSamplePackChanged(newOption) {
      this.options.indexOf(newOption);
      this.sampleMetadata
    },
    async handleSubmitForm() {
      if(await this.$store.dispatch('form/validateForm')){
        try {
          this.$store.commit('app/isLoading', true);
          
          await this.$store.dispatch('sample/uploadSample', {
            sampleData: {...this.sampleMetadata},
            sample: this.sampleBlob,
            image: this.imageBlob,
            imageSrc: this.imageSrc,
          });

          // await this.$store.dispatch('sample/uploadSamplePack',{
          //   name: 'New Sample Pack',
          //   samples: [{
          //     sampleData: {...this.sampleMetadata},
          //     sample: this.sampleBlob,
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
