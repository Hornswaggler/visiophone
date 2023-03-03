<template>
  <div class="add-sample-panel">
    <div class="form-column">
      <div class="vp-form-row">
        <form-input
          title="name"
          :fieldName="`${fieldPrefixInternal}name`"
          :value="sampleInternal.name" 
          :on-changed="name => onChanged({key: 'name', value: name })"
        />
      </div>

      <div class="vp-form-row mt0">
        <form-input
          title="key"
          :fieldName="`${fieldPrefixInternal}key`" 
          :value="sampleInternal.key" 
          :on-changed="key => onChanged({key: 'key', value: key })"
        />
      </div>

      <div class="vp-form-row">
        <text-area-input 
          title="description"
          :fieldName="`${fieldPrefixInternal}description`"
          :value="sampleInternal.description"
          :on-changed="description => onChanged({key: 'description', value: description })"
        />
      </div>
    </div>

    <div class="form-column">
      <div class="vp-form-row">
        <form-upload-file
          title="audio file"
          :fieldName="`${fieldPrefixInternal}clipUri`"
          :value="sampleInternal.clipUri"
          :accept="AUDIO_MIME_TYPE"
          button-text="Upload"
          :change-handler="({file, clipUri}) => {
            onChanged({key: 'sampleBlob', value: file});
            onChanged({key: 'clipUri', value: clipUri});
          }"
        />
      </div>
      
      <div class="vp-form-row">
        <form-select title="tag"
          :fieldName="`${fieldPrefixInternal}tag`" 
          :options="tags" 
          :value="sampleInternal.tag"
          :on-changed="tag => onChanged({key: 'tag', value: tag })"
        />
      </div>

      <div class="vp-form-row flex-column flex">
        <form-number-input
          title="cost" 
          :fieldName="`${fieldPrefixInternal}cost`"
          :value="sampleInternal.cost"
          :on-changed="cost => onChanged({key: 'cost', value: cost })"
        />
      </div>

      <div class="vp-form-row">
        <form-number-input 
          title="bpm"
          :fieldName="`${fieldPrefixInternal}bpm`"
          :value="sampleInternal.bpm"
          :on-changed="bpm => onChanged({key: 'bpm', value: bpm })"
        />
      </div>
    </div>
      <!-- TODO Implement this for something... -->
      <!-- <compact
        v-model="colors"
      ></compact> -->
  </div>
</template>

<script>
import Vue from 'vue';
import FormInput from '@/components/form/FormInput.vue';
import TextAreaInput from '@/components/form/TextAreaInput.vue';
import FormUploadFile from '@/components/form/FormUploadFile.vue';
import FormSelect from '@/components/form/FormSelect.vue';
import FormNumberInput from '@/components/form/FormNumberInput.vue';

import { AUDIO_MIME_TYPE, IMAGE_MIME_TYPE } from '@/config';

const TAG_TYPES = [
  { name: 'InfluencerCore' },
  { name: 'jazz' },
  { name: 'rnb' },
  { name: 'smooth influencercore' },
  { name: 'Influencing Influencercore' }
].map((type, i) => ({ ...type, id: i }));

export default {
  name: 'SampleEditor',
  components:{
    FormInput,
    TextAreaInput,
    FormUploadFile,
    FormSelect,
    FormNumberInput
  },
  data: () => ({
    sampleInternal: {},
    AUDIO_MIME_TYPE,
    tags: [...TAG_TYPES],
    fieldPrefixInternal: '',
  }),
  props:{
    fieldPrefix: {
      type: String,
      default: ''
    },
    sample: {
      type: Object,
      default: {}
    },
    onChanged: {
      type: Function,
      default: () => {}
    }
  },
  mounted(){
    if(this.fieldPrefix.length > 0){
      this.fieldPrefixInternal = `${this.fieldPrefix}.`;
    }
    Vue.set(this, 'sampleInternal', this.sample);
  }
}
</script>
