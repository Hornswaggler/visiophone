<template>
  <form-input-base
    :title="title"
    :validations="validations"
    :value="fileName"
    :fieldName="fieldName"
  >
    <template v-slot:title>
      {{ title }}
    </template>
    <template
      v-slot:input
    >
      <div class="form-file-upload form-input-body">
        <span
          class="form-file-upload-button"
          @click="handleBrowseUpload"
        >
          <span>
            Browse
          </span>
        </span>
        <div class="form-file-upload-button-spacer">
          {{ fileName }}
        </div>
      </div>
      <input
        ref="file"
        type="file"
        class="hidden"
        :accept="accept"
        @change="onInputChanged"
      >
    </template>
  </form-input-base>
</template>
<script>
import { mapState } from 'vuex';
import FormInputBase from '@/components/form/FormInputBase.vue';

export default {
  name: 'UploadFile',
  components: { FormInputBase },
  data: () => ({
    fileName:''
  }),
  props: {
    validations:{
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: '',
    },
    accept:{
      type: String,
      default: '*/*'
    },
    changeHandler:{
      type: Function,
      default: () => {}
    },
    fieldName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('sample', ['sampleForEdit'])
  },
  methods:{
    onInputChanged({target:{files}}) {
      this.fileName = (files[0] && files[0].name) || '';
      this.changeHandler(files[0]);
    },
    handleBrowseUpload() {
      this.$refs.file.focus();
      this.$refs.file.click();
    },
  }
}
</script>
