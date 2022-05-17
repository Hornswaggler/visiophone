<template>
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

      <div class="flex-1"></div>
    </div>
  </div>
</div>
</template>
<script>
import Header from '@/components/layout/Header.vue';
import StatusBar from '@/components/form/StatusBar';
import UploadFile from '@/components/form/UploadFile';
import TextAreaInput from '@/components/form/TextAreaInput';

import { mapState } from 'vuex';
import TagEditor from '../form/TagEditor.vue';

export default {
  name: 'Upload',
  computed: {
    ...mapState('user',['authenticated','shelfCapacity'])
  },
  components: {
    Header,
    StatusBar,
    UploadFile,
    TagEditor,
    TextAreaInput
  }
}
</script>
<style lang="scss">
</style>