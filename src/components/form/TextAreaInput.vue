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
      <div class="form-textarea-container">
        <textarea
          :rows="rows"
          v-model="internalValue"
          v-debounce="onChangeHandler"
          class="form-textarea"
          type="text"
          @blur="onChangeHandler(internalValue)"
        />
      </div>
    </template>
  </form-input-base>
</template>

<script>
import FormInputBase from './FormInputBase.vue';
export default {
  name: "TextAreaInput",
  components: { FormInputBase },
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: ''
    },
    onChanged: {
      type: Function,
      default: () => {}
    },
    fieldName: {
      type: String,
      default: ''
    },
    rows: {
      type: String,
      default:'2'
    }
  },
  data: () => ({
    internalValue:''
  }),
  mounted() {
    this.$nextTick(() => {
      this.internalValue = this.value;
    });
  },
  methods:{
    onChangeHandler(value){
      this.onChanged(value);
      this.$store.dispatch('form/validateField', {field: this.fieldName, value});
    },
  }
}
</script>