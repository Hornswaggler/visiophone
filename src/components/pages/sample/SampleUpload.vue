<template>
  <div
    class="fill vp-form"
    style="color:#66FF00;"
  >
    <div class="vp-form-row">
      <UploadFile
        button-text="Upload"
        class="flex-3"
      />
    </div>

    <div class="vp-form-row">
      <FormSelect 
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
import UploadFile from '@/components/form/UploadFile';
import TextAreaInput from '@/components/form/TextAreaInput';

import { mapState, mapGetters } from 'vuex';
import FormSelect from '@/components/form/FormSelect.vue';

const defaultSample = {
  description: '',
  tag: 'InfluencerCore'
};

export default {
  name: 'SampleUpload',
  data: () => ({...defaultSample}),
  computed: {
    ...mapGetters('user', ['accessToken']),
    ...mapState('user',['authenticated','shelfCapacity', 'apiToken']),
    model(){
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
    TextAreaInput
  },
  methods: {
    async handleSubmitForm() {
      try {
        this.$store.commit('app/isLoading', true);

        await this.$store.dispatch('sample/uploadBuffer', { 
          sampleData: this.model,
          token: this.apiToken
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
    goBack() {
      this.$router.push('/sample');
    },
    onTextAreaInputChanged(description){
      this.description = description;
    }
  }
}
</script>
<style lang="scss">

</style>