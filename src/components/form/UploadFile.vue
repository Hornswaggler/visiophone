<template>
  <form-input-base>
    <template v-slot:title>
      upload audio file
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
        @change="changeHandler($refs['file'])"
      >
    </template>
  </form-input-base>
</template>
<script>
import { mapGetters } from 'vuex';
import FormInputBase from '@/components/form/FormInputBase';

export default {
  name: 'UploadFile',
  computed:{
    ...mapGetters('sample',['fileName']),
  },
  components: { FormInputBase },
  props: {
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
    }
  },
  methods:{
    handleBrowseUpload() {
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
  min-height:4em;
  border: solid 1px rgb(118, 118, 118);
}
.vp-upload-button {
  padding: 0 0.5em;
  cursor: pointer;
  display:flex;
  align-items: center;
  height:100%;
  transition: all 0.25s ease-in-out;
  min-height: 4em;

  &:hover {
    background-color:white;
    color:black;
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