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
      style="height:2em;"
    >
      <div class="vp-upload-file">
        <span
          class="vp-upload-button"
          @click="handleBrowseUpload"
        >
          <span>
            Browse
          </span>
        </span>
        <div class="vp-upload-button-spacer">
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
<style lang="scss">
.vp-upload-file {
  display:flex;
  justify-content: flex-start;
  align-items: center;
}
.vp-upload-button {
  padding: 0 0.5em;
  cursor: pointer;
  display:flex;
  align-items: center;
  height: 100%;
  transition: all 0.25s ease-in-out;
  background-color:var(--vp-form-button-background-color);

  &:hover {
    background-color:var(--vp-form-button-hover-background-color);
    color:black;
    z-index: 2;
  }
}
.vp-upload-button-spacer {
  height:2em;
  flex:1;
  border-left: solid 1px white;
  overflow: hidden;
  line-height: 2;
  text-align:left;
  padding: 0 0.5em;
}
</style>