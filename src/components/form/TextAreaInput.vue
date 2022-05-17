<template>
  <FormInput>
    <template v-slot:title>{{title}}</template>
    <template v-slot:input style="height:initial;">
      <div class="vp-text-area-input">
      <textarea 
        class="vp-textarea"
        rows="3" 
        type="text" 
      ></textarea>
      </div>
    </template>
  </FormInput>
</template>

<script>
import FormInput from './FormInput.vue';
export default {
  name: "TextAreaInput",
  components: { FormInput },
  props: {
    title: {
      type: String,
      default: '',
    },
  }
}
</script>
<style lang="scss">
.vp-textarea {
  width:100%;
  height:100%;
  background-color:transparent;
}
.vp-text-area-input {
  flex:1;
  display:flex;
  justify-content: flex-start;
  align-items: center;
  border: solid 1px white;
  padding:0;
  width: 100%;
}
</style>