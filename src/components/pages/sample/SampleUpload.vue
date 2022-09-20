<template>
  <div
    class="fill vp-form"
    style="color:#66FF00;"
  >
    <div class="vp-form-row">
      <UploadFile
        :accept="AUDIO_MIME_TYPE"
        button-text="Upload"
        class="flex-3"
        :change-handler="sampleInputChangeHandler"
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
import {AUDIO_MIME_TYPE} from '@/config';

const defaultSample = {
  description: '',
  tag: 'InfluencerCore'
};

export default {
  name: 'SampleUpload',
  data: () => ({
    ...defaultSample,
    AUDIO_MIME_TYPE
  }),
  computed: {
    ...mapGetters('user', ['accessToken']),
    ...mapState('user',['authenticated','shelfCapacity', 'apiToken']),
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
    TextAreaInput
  },
  mounted() {
    this.$store.commit('app/setSideNavigationIndex', 1);
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
    sampleInputChangeHandler(el) {
      this.$store.dispatch('sample/setFileBuffer',el.files[0]);
    },
    goBack() {
      this.$router.push('/sample');
    },
    onTextAreaInputChanged(description) {
      this.description = description;
    }
  }
}
</script>
<style lang="scss">

</style>