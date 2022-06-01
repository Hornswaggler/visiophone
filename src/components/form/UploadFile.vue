<template>
  <FormInput>
    <template v-slot:info>
      we accept .wav .mid
    </template>
    <template v-slot:input style="height:2em;">
      <div class="vp-upload-file">
        <span @click="handleBrowseUpload" class="vp-upload-button">
          <span>
            Browse
          </span>
        </span>
        <div class="vp-upload-button-spacer">{{fileName}}</div>
      </div>
      <input type="file" class="hidden" accept="audio/wav"  @change="prepareUpload"  ref="file"/>

    </template>
  </FormInput>
</template>
<script>
import { mapGetters } from 'vuex';
import FormInput from '@/components/form/FormInput';
import axios from 'axios';

export default {
  name: 'UploadFile',
  mounted() {
  },
  data:() => ({
    fileBuffer: null,
  }),
  computed:{
    ...mapGetters('sample',['fileName']),
  },
  components: { FormInput },
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
    uploadFile() {
      const formData = new FormData();
      formData.append('file', this.fileBuffer);

      const headers = { 'Content-Type': 'multipart/form-data' };
      axios.post('http://localhost:7071/api/upload_sample', formData, { headers }).then((res) => {
        res.data.files;
        res.status;
      });
    }
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