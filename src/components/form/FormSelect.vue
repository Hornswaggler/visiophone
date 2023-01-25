<template>
  <form-input-base
    :title="title"
    :value="internalValue"
    :fieldName="fieldName"
  >
    <template v-slot:title>
      {{ title }}
    </template>
    <template v-slot:input>
      <select 
        v-model="internalValue"
        class="form-select"
        @change="({target:{value}}) => onChangeHandler(value)"
      >
        <option 
          v-for="option in internalOptions"
          :key="option._id" 
          class="form-select-option"
        >
          {{ option.name }}
        </option>
      </select>
    </template>
  </form-input-base>
</template>
<script>
import FormInputBase from '@/components/form/FormInputBase.vue';

export default {
  name: 'FormSelect',
  components: { FormInputBase },
  props:{
    fieldName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    onChanged: {
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    internalOptions: [],
    internalValue: ''
  }),
  mounted(){
    this.internalValue = this.value;
    this.internalOptions = this.options;
  },
  methods:{
    onChangeHandler(value) {
      this.onChanged(value);
      this.$store.dispatch('form/validateField', {field: this.fieldName, value});
    }
  }
}
</script>