<template>
  <form-input-base
    :title="title"
    :value="internalValue"
    :fieldName="fieldName"
  >
    <template v-slot:title>
      {{ title }}
    </template>
    <template
      v-slot:input
      style="height:initial;"
    >
      <input
        step="0.01"
        v-model="internalValue"
        class="form-number-input"
        type="number"
        @change="onChanged"
      >
    </template>
  </form-input-base>
</template>

<script>
import FormInputBase from './FormInputBase.vue';

export default {
  name:'FormNumberInput',
  components:{
    FormInputBase
  },
  data: () => ({
    internalValue:''
  }),
  props:{
    fieldName: {
      type: String,
      default: ''
    },
    title:{
      type: String,
      default: ''
    },
    value:{
      type: String,
      default: "0"
    },
    changeHandler:{
      type: Function,
      default: () => {}
    }
  },
  mounted(){
    this.internalValue = this.value;
  },
  methods:{
    onChanged({target:{value}}){
      this.changeHandler(value);
    }
  }
}
</script>

<style lang="scss">
.form-number-input {
  border:none;
  background-color: transparent;
  box-sizing: border-box;
  font-size: var(--vp-form-text-size);
  padding: var(--vp-input-padding);
  color: white;
}
</style>