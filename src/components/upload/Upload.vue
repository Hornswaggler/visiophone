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
          <div class="vp-upload-margin-left">
            <div>&nbsp;</div>
            <div style="justify-content:flex-end;width:100%;flex:1;display:flex;align-items: center;">&nbsp;</div>
          </div>
          <div
            style="
            flex:2;
            height:100%;
            display:flex;
            flex-direction:column;"
          >
            <div>
              shelf upload limit
            </div>
            <div style="
              width:100%;
              height:1em;
              flex:1;
              border: solid 1px lightgrey;
              display:flex;"
            >
              <div style="height:100%;width:75%;background-color:lightgrey;"></div>
            </div>
          </div>
          <div style="flex:1"></div>
      </div>
      <div class="vp-form-row">
        <div class="vp-upload-margin-left">
          <div>&nbsp;</div>
          <div style="justify-content:flex-end;width:100%;flex:1;display:flex;align-items: center;">&nbsp;</div>
        </div>
        <div
          style="
          flex:2;
          height:100%;"
        >
          <div>
            we accept .wav .mid
          </div>
          <div
            style="
            height:2em;
            flex:1;
            background-color:rgb(51, 51, 51);
            display:flex;
            justify-content: flex-start;
            align-items: center;"
          >
            <span class="vp-button">
              <span>
                Upload
              </span>
            </span>
            <span style="
              height:100%;
              flex:1;
              border-left: solid 1px white;">
            </span>
          </div>
        </div>
        <div style="flex:1"></div>
      </div>
      <div class="vp-form-row">
        <div class="vp-upload-margin-left">
          <div>&nbsp;</div>
          <div style="justify-content:flex-end;width:100%;flex:1;display:flex;align-items: center;">tags:</div>
        </div>
        <div
          style="
          flex:2;
          height:100%;"
        >
          <div
            style="
            height:2em;
            flex:1;
            display:flex;
            justify-content: flex-start;
            align-items: center;
            border: solid 1px white;
            margin-top: 1em;
            width: 100%;"
          >
            <input type="text" style="width:100%;background-color:transparent;"/>
          </div>
        </div>
        <div style="flex:1"></div>
      </div>
      <div class="vp-form-row">
        <div class="vp-upload-margin-left">
          <div>&nbsp;</div>
          <div style="justify-content:flex-end;width:100%;flex:1;display:flex;align-items: center;">description:</div>
        </div>
        <div
          style="
          flex:2;
          height:100%;"
        >
          <div
            style="
            height:2em;
            flex:1;
            display:flex;
            justify-content: flex-start;
            align-items: center;
            border: solid 1px white;
            margin-top: 1em;
            width: 100%;"
          >
            <textarea type="text" style="width:100%;background-color:transparent;"></textarea>
          </div>
        </div>
        <div style="flex:1"></div>
      </div>
      <div style="flex:1;"></div>
    </div>
  </div>
</div>
</template>
<script>
import Header from '@/components/layout/Header.vue';
import {mapState} from 'vuex';

export default {
  name: 'Upload',
  computed: {
    ...mapState('user',['authenticated'])
  },
  components: { Header }
}
</script>
<style lang="scss">
.vp-button {
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

.vp-upload-margin-left {
  flex:1;
  height:100%;
  display:flex;
  align-items:center;
  padding-right: 1em;
  flex-direction:column;
}

.vp-form-row {
  background-color:grey;
  // margin:2em;
  display:flex;
  justify-content:flex-start;
  // padding:1em;
  // border: solid 1px white;
  font-size: 0.75em;
  color: white;
}
</style>