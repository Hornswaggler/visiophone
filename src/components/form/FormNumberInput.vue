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
    >
      <input
        step="0.01"
        v-model="internalValue"
        class="form-input-body"
        type="number"
        v-debounce="onChangeHandler"
        @blur="onChangeHandler(internalValue)"
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
    onChanged:{
      type: Function,
      default: () => {}
    }
  },
  mounted(){
    this.internalValue = this.value;
  },
  methods:{
    onChangeHandler(value){
      this.onChanged(value);
      this.$store.dispatch('form/validateField', {field: this.fieldName, value});
    }
  }
}
</script>