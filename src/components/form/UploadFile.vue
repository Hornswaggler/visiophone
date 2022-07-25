<template>
  <form-input-base>
    <template v-slot:info>
      we accept .wav .mid
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
        accept="audio/*"
        @change="prepareUpload"
      >
    </template>
  </form-input-base>
</template>
<script>
import { mapGetters } from 'vuex';
import FormInputBase from '@/components/form/FormInputBase';
import axios from 'axios';

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
  },
  methods:{
    handleBrowseUpload() {
      this.$refs.file.click();
    },
    prepareUpload() {
      this.$store.dispatch('sample/setFileBuffer', this.$refs.file.files[0]);
    },
  }
}
</script>
<style lang="scss">
.vp-upload-file {
  background-color:rgb(51, 51, 51);
  display:flex;
  justify-content: flex-start;
  align-items: center;
  height:2em
}
.vp-upload-button {
  padding: 0 0.5em;
  cursor: pointer;
  display:flex;
  align-items: center;
  height:100%;
  transition: all 0.25s ease-in-out;

  &:hover {
    background-color:white;
    color:black;
  }
}
.vp-upload-button-spacer {
  height:100%;
  flex:1;
  border-left: solid 1px white;
  overflow: hidden;
  line-height: 2;
  text-align:left;
  padding: 0 0.5em;
}
</style>