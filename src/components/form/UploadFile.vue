<template>
  <FormInput>
    <template v-slot:info>
      we accept .wav .mid
    </template>
    <template v-slot:input style="height:2em;">
      <div class="vp-upload-file">
        <span class="vp-button">
          <span>
            {{buttonText}}
          </span>
        </span>
        <span class="vp-button-spacer"></span>
      </div>
    </template>
  </FormInput>
</template>
<script>
import FormInput from '@/components/form/FormInput';

export default {
  name: 'UploadFile',
  components: { FormInput },
  props: {
    buttonText: {
      type: String,
      default: '',
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
.vp-button-spacer {
  height:100%;
  flex:1;
  border-left: solid 1px white;
}
</style>