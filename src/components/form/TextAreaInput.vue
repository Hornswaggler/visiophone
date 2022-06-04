<template>
  <FormInput>
    <template v-slot:title>{{title}}</template>
    <template v-slot:input style="height:initial;">
      <div class="vp-text-area-input">
      <textarea
        v-model="internalValue"
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
  data: () => ({
    internalValue:''
  }),
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: ''
    },
    changeHandler: {
      type: Function,
      default: () => {}
    }
  },
  watch:{
    internalValue(val){
      this.changeHandler(val);
    }
  },
  mounted() {
    this.internalValue = this.value;
  },
  methods:{
    emitOnChange(){
      this.changeHandler();
    }
  }
}
</script>
<style lang="scss">
.vp-textarea {
  width:100%;
  height:100%;
  background-color:transparent;
  color:white;
  padding: 0.5em 0.5em;
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