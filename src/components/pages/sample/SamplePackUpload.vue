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
                :value="samplePackForEdit.name"
                title="sample pack name"
                :on-changed="value => onSamplePackChanged({key: 'name', value})"
              />
            </div>
            <div class="vp-form-row flex-column flex">
              <form-number-input
                title="cost"
                fieldName="cost"
                :value="samplePackForEdit.cost"
                :on-changed="value => onSamplePackChanged({key: 'cost', value})"
              />
            </div>
            <div class="vp-form-row">
              <form-input
                fieldName="description"
                :value="samplePackForEdit.description"
                title="sample pack description"
                :on-changed="value => onSamplePackChanged({key: 'description', value})"
              />
            </div>
          </div>
          <div class="form-column pr0">
            <div class="vp-form-row user-settings-image-container">
              <form-image-editor
                class="flex-1"
                fieldName="imgUrl"
                title="sample pack image"
                :value="{imgUrl: samplePackForEdit.imgUrl, imagePreviewBlob, imageBlob, imageFile}"
                :change-handler="onThumbnailGenerated"
              />
            </div>
          </div>
        </div>

        <collapsible-panel
          v-for="(sample, key) in samplePackForEdit.samples"
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
              :field-prefix="`samples.${key}`"
              :sample="sample"
              :on-changed="({key, value}) => onSampleChanged({key, value, sample})"
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
import {mapState} from 'vuex';
import FormInput from '@/components/form/FormInput.vue';
import FormImageEditor from '@/components/form/FormImageEditor.vue';
import CollapsiblePanel from '../../form/CollapsiblePanel.vue';
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
    samplePanelState: {},
    initialized: false
  }),
  computed: {
    ...mapState('samplePackEdit', ['samplePackForEdit', 'imageBlob', 'imagePreviewBlob', 'imageFile']),
    rgba() {
      return this.colors.rgba || { r: 0, g: 0, b: 0, a: 0 };
    },
  },
  mounted() {
    if(!this.initialized) {
      this.$store.dispatch('samplePackEdit/initialize');
      this.$store.dispatch('form/initialize', { formName: 'samplePack' });
      this.initialized = true;
    }
  },
  methods:{
    deleteSample(tempId) {
      this.$store.dispatch('samplePackEdit/deleteSample', {tempId});
    },
    onPanelChanged({key, value}){
      this.samplePanelState[key] = value;
    },
    onSamplePackChanged({key,value}){
      this.$store.dispatch('samplePackEdit/updateSamplePackProperty', {key, value});
    },
    onSampleChanged({key, value, sample})  {
      this.$store.dispatch('samplePackEdit/updateSampleProperty', {key, value, sample});
    },
    onThumbnailGenerated({ clipUri: imgUrl, imageFile, imagePreviewBlob}) {
      this.$store.dispatch('samplePackEdit/setSamplePackImage', {imgUrl, imageFile, imagePreviewBlob});
    },
    async addSample({scrollToElement = false}) {
      const _tempId = await this.$store.dispatch('samplePackEdit/addSample');

      Vue.set(this.samplePanelState, _tempId, false);
      if(scrollToElement) {
        this.$nextTick(() => {
          this.$store.dispatch('app/scrollToElement', this.$refs.submitButton);
        });
      }
    },
    async handleSubmitForm() {
      if (await this.$store.dispatch('form/validateForm', { formData: this.samplePackForEdit })) {
        try {
          this.$store.commit('app/isLoading', true);
          await this.$store.dispatch('samplePack/uploadSamplePack', {
            samplePack: this.samplePackForEdit,
            imageBlob: this.imagePreviewBlob,
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
