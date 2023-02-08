<template>
<div>
    <div>
      <div class="form-base flex-1"
        :style="{ backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` }">
        <div class="add-sample-panel">
          <div class="form-column pl0">
            <div class="vp-form-row">
              <form-input
                fieldName="name"
                :value="samplePack.name"
                title="sample pack name"
                :on-changed="name => samplePack.name = name"
              />
            </div>
            <div class="vp-form-row">
              <form-input
                fieldName="description"
                :value="samplePack.description"
                title="sample pack description"
                :on-changed="description => samplePack.description = description"
              />
            </div>
          </div>
          <div class="form-column pr0">
            <div class="vp-form-row user-settings-image-container">
              <form-image-editor
                class="flex-1"
                fieldName="imgUrl"
                title="sample pack image"
                :img-src="imageSrc"
                :change-handler="onThumbnailGenerated"
              />
            </div>
          </div>
        </div>

        <collapsible-panel
          v-for="(sample, key) in samplePack.sampleData"
          :collapsed="samplePanelState[key]"
          :key="key"
          :on-changed="value => onPanelChanged({ key, value })"
        >
          <template v-slot:header>
            <div class="flex justify-space-between">
              <button
                class="vp-button sm delete-button"
                type="button"
                @click="deleteSample(key)"
              >
                -
              </button>
            </div>
          </template>
          <template v-slot:content>
            <sample-editor
              :field-prefix="`sampleData.${key}`"
              :sample="sample"
              :on-changed="({key, value}) => onChanged({key, value, sample})"
            />
          </template>
        </collapsible-panel>
      </div>
    </div>
    <div class="vp-form-row flex justify-end pb1">
    </div>
    <div class="vp-form-row flex-1">
      <div class="flex fill-height justify-space-between">
        <div class="flex-1">&nbsp;</div>
        <div class="flex-1 flex justify-center align-end">
          <button 
            class="vp-button sm"
            type="button"
            @click="addSample"
          >
            +
          </button>
        </div>
        <div class="flex-1 flex justify-end  align-end">
          <button 
            ref="submitButton" 
            class="vp-button" 
            type="button" 
            @click="handleSubmitForm"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  </div></template>

<script>
import Vue from 'vue';
import FormInput from '@/components/form/FormInput.vue';
import FormImageEditor from '@/components/form/FormImageEditor.vue';
import { v4 as uuidv4 } from 'uuid';
import { makeNewSample } from '@/store/modules/sample';
import CollapsiblePanel from '../../form/CollapsiblePanel.vue';
import { AUDIO_MIME_TYPE, IMAGE_MIME_TYPE } from '@/config';
import TextAreaInput from '@/components/form/TextAreaInput.vue';
import FormUploadFile from '@/components/form/FormUploadFile.vue';
import FormSelect from '@/components/form/FormSelect.vue';
import FormNumberInput from '@/components/form/FormNumberInput.vue';
import SampleEditor from './SampleEditor.vue';

const TAG_TYPES = [
  { name: 'InfluencerCore' },
  { name: 'jazz' },
  { name: 'rnb' },
  { name: 'smooth influencercore' },
  { name: 'Influencing Influencercore' }

].map((type, i) => ({ ...type, _id: i }));

export default {
  name: 'SamplePackUpload',
  components:{
    FormInput,
    FormImageEditor,
    CollapsiblePanel,
    TextAreaInput,
    FormUploadFile,
    FormSelect,
    FormNumberInput,
    SampleEditor
  },
  data: () => ({
    colors: { r: 255, g: 0, b: 0 },
    isSamplePack: true,
    samplePack: {
      description: '',
      name: '',
      imgUrl: '',
      sampleData: {}
    },
    imageSrc: '',
    samplePanelState: {},
    AUDIO_MIME_TYPE,
    imageBlob: {},
    tags: [...TAG_TYPES],
  }),
  computed: {
    rgba() {
      return this.colors.rgba || { r: 0, g: 0, b: 0, a: 0 };
    },
  },
  mounted(){
    this.addSample({scrollToElement: false});
    this.$store.dispatch('form/initialize', { formName: 'samplePack' });
  },
  methods:{
    deleteSample(key) {
      Vue.delete(this.samplePack.sampleData, key)
    },
    onPanelChanged({key, value}){
      this.samplePanelState[key] = value;
    },
    onChanged({key, value, sample:{_tempId}}){
      Vue.set(this.samplePack.sampleData[_tempId], key, value);
    },
    onThumbnailGenerated({ file, clipUri }) {
      Vue.set(this, 'imageBlob', file);
      Vue.set(this.samplePack, 'imgUrl', clipUri);
    },
    addSample({scrollToElement = false}) {
      const _tempId = uuidv4();
      Vue.set(this.samplePack.sampleData, _tempId, {
        _tempId,
        ...makeNewSample()
      });

      Vue.set(this.samplePanelState, _tempId, false);
      if(scrollToElement) {
        this.$nextTick(() => {
          this.$store.dispatch('app/scrollToElement', this.$refs.submitButton);
        });
      }
    },
    async handleSubmitForm() {
      if (await this.$store.dispatch('form/validateForm', { formData: this.samplePack })) {
        try {
          this.$store.commit('app/isLoading', true);
          const { samplePack, imageBlob, imageSrc } = this;

          await this.$store.dispatch('samplePack/uploadSamplePack', {
            samplePack,
            imageBlob,
            imageSrc
          });

          //TODO: Uncomment once completed...
          // this.$router.push('/search');
        } catch (e) {
          console.error(e);
        } finally {
          this.$store.commit('app/isLoading', false);
        }
      } else {
        this.onCollapseExpandAll(false);
        this.$store.dispatch('app/scrollToFirstError');
      }
    },
    onCollapseExpandAll(isCollapsed){
      const keys = Object.keys(this.samplePanelState);
      for(let i = 0; i < keys.length; i++) {
        this.samplePanelState[keys[i]] = isCollapsed;
      }
    },
  },

}
</script>
