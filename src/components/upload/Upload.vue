<template>
  <div style="color:#66FF00;">
    <div class="css-selector">
      <Header />
    </div>
    <div 
      class="css-selector"
      style="width:100%;
    display:flex;
    flex-direction:column;
    overflow-y:auto;
    height: calc(100vh - 172px)"
    >
      <!-- TODO: Container Class -->
      <div
        style="
      height:100%;
      width:100%;
      display:flex;
      flex-direction:column;
      background-color:grey;"
      >
        <div class="vp-form-row">
          <StatusBar
            style="flex:3"
            :percent-complete="shelfCapacity"
            :info="'shelf upload limit'"
          />
          <div class="flex-1" />
        </div>

        <div class="vp-form-row">
          <UploadFile
            button-text="Upload"
            class="flex-3"
          />
          <div class="flex-1" />
        </div>

        <div class="vp-form-row">
          <FormSelect 
            title="tag"
            :value="tag"
            class="flex-3"
          />
          <div class="flex-1" />
        </div>

        <div class="vp-form-row">
          <TextAreaInput
            :change-handler="onTextAreaInputChanged"
            :value="description"
            class="flex-3"
            title="description"
          />
          <div class="flex-1" />
        </div>

        <div class="vp-form-row pt1">
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
          <div class="flex-1" />
        </div>

        <div class="flex-1" />
      </div>
    </div>
  </div>
</template>
<script>
import Header from '@/components/layout/Header.vue';
import StatusBar from '@/components/form/StatusBar';
import UploadFile from '@/components/form/UploadFile';
import TextAreaInput from '@/components/form/TextAreaInput';

import { mapState, mapGetters } from 'vuex';
import FormSelect from '../form/FormSelect.vue';

const defaultSample = {
  description: '',
  tag: 'InfluencerCore'
};

export default {
  name: 'Upload',
  data: () => ({...defaultSample}),
  computed: {
    ...mapGetters('user', ['accessToken']),
    ...mapState('user',['authenticated','shelfCapacity']),
    model(){
      const {description, tag} = this;
      return {
        description,
        tag
      }
    }
  },
  components: {
    Header,
    StatusBar,
    UploadFile,
    FormSelect,
    TextAreaInput
  },
  methods: {
    async handleSubmitForm() {
      try {
        this.$store.commit('app/isLoading', true);
        const result = await this.$store.dispatch('sample/uploadBuffer', this.model);

        Object.keys(defaultSample).map(key => {
          this[key] = defaultSample[key];
        })

        this.$router.push('/console');
      } catch (e) {
        console.error(e);
      } finally {
        this.$store.commit('app/isLoading', false);
      }
    },
    goBack() {
      this.$router.push('/console');
    },
    onTextAreaInputChanged(description){
      this.description = description;
    }
  }
}
</script>
<style lang="scss">

</style>