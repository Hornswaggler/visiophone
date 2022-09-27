<template>
  <form-input-base>
    <template 
      v-slot:title
    >
      {{ title }}
    </template>
    <template v-slot:input>
      <select 
        v-model="internalValue"
        class="vp-select"
        @change="onChange"
      >
        <option 
          v-for="option in internalOptions"
          :key="option._id" 
          class="vp-select-option"
        >
          {{ option.name }}
        </option>
      </select>
    </template>
  </form-input-base>
</template>
<script>
import FormInputBase from '@/components/form/FormInputBase';

export default {
  name: 'FormSelect',
  components: { FormInputBase },
  props:{
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
    changeHandler: {
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
    onChange({target:{value}}) {
      this.changeHandler(value);
    }
  }
}
</script>
<style lang="scss">
.vp-select {
  font-size: var(--vp-form-text-size);
  padding: var(--vp-input-padding);
  flex:1;
  display:flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  background-color:transparent;
  color:white;
  cursor:pointer;

  .vp-select-option {
    font-size: var(--vp-form-select-option-font-size);
    color: var(--vp-form-select-option-color);
    background-color: var(--vp-form-select-option-background-color);
    cursor:pointer;
    &:hover {
      cursor:pointer;
    }
  }


}
</style>