<template>
<form action="http://localhost:7071/api/upload_sample" enctype="multipart/form-data"  method="post">
  <div style="color:#66FF00;">
    <div class="css-selector">
      <Header></Header>
    </div>
    <div 
      class="css-selector"
      style="width:100%;
      display:flex;
      flex-direction:column;
      overflow-y:auto;
      height: calc(100vh - 172px)"
    >
      <div style="
        height:100%;
        width:100%;
        display:flex;
        flex-direction:column;
        background-color:grey;"
      >
        <div class="vp-form-row">
          <StatusBar style="flex:3"
            :percentComplete="shelfCapacity"
            :info="'shelf upload limit'"
          ></StatusBar>
          <div class="flex-1"></div>
        </div>

        <div class="vp-form-row">
          <UploadFile
            buttonText="Upload"
            class="flex-3"
          ></UploadFile>
          <div class="flex-1"></div>
        </div>

        <div class="vp-form-row">
          <TagEditor 
            title="tags"
            class="flex-3"
          ></TagEditor>
          <div class="flex-1"></div>
        </div>

        <div class="vp-form-row">
          <TextAreaInput 
            class="flex-3"
            title="description"
          ></TextAreaInput>
          <div class="flex-1"></div>
        </div>

        <div class="vp-form-row pt1">
          <div class="flex-3 flex justify-end">
            <button @click="handleSubmitForm" class="vp-button" type="button">Upload</button>
          </div>
          <div class="flex-1"></div>
        </div>

        <div class="flex-1"></div>
      </div>
    </div>
  </div>
</form>
</template>
<script>
import Header from '@/components/layout/Header.vue';
import StatusBar from '@/components/form/StatusBar';
import UploadFile from '@/components/form/UploadFile';
import TextAreaInput from '@/components/form/TextAreaInput';

import { mapState, mapGetters } from 'vuex';
import TagEditor from '../form/TagEditor.vue';

export default {
  name: 'Upload',
  computed: {
    ...mapGetters('user', ['accessToken']),
    ...mapState('user',['authenticated','shelfCapacity'])
  },
  components: {
    Header,
    StatusBar,
    UploadFile,
    TagEditor,
    TextAreaInput
  },
  methods: {
    handleSubmitForm() {
      console.log('Uploading');

      this.$store.dispatch('sample/uploadBuffer', this.accessToken);

      // const headers = { 'Content-Type': 'multipart/form-data' };
      // axios.post('http://localhost:7071/api/upload-sample', formData, { headers }).then((res) => {
      //   res.data.files;
      //   res.status;
      // });
    }
  }
}
</script>
<style lang="scss">

</style>