<template>
  <div class="form-base">
    <sample-editor
      field-prefix=""
      :sample="sample"
      :on-changed="onChanged"
    />
    <div class="vp-form-row flex-1">
        <div 
          class="flex fill-height justify-space-between" 
        >
          <div class="flex-1">&nbsp;</div>

          <div class="flex-1 flex justify-end  align-end">
            <button 
              ref="submitButton"
              class="vp-button"
              type="button" @click="handleSubmitForm"
            >
              Upload
            </button>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import SampleEditor from './SampleEditor.vue';
import { makeNewSample } from '@/store/modules/sample';

export default {
  name: 'SingleSampleUpload',
  components:{
    SampleEditor
  },
  data: () => ({
    sample: makeNewSample()
  }),
  mounted(){
    this.$store.dispatch('form/initialize', { formName: 'sample' });
  },
  methods: {
    onChanged({key, value}){
      Vue.set(this.sample, key, value );
    },
    async handleSubmitForm() {
      if (await this.$store.dispatch('form/validateForm', { formData: this.sample })) {
        try {
          this.$store.commit('app/isLoading', true);
          await this.$store.dispatch('sample/uploadSample', {
            sample: this.sample
          });
        } catch (e) {
          console.error(e);
        } finally {
          this.$store.commit('app/isLoading', false);
        }
      } else {
        //TODO: Do we need to add this feature back? :|
        // this.onCollapseExpandAll(false);
        this.$store.dispatch('app/scrollToFirstError');
      }
    },
  }
}
</script>