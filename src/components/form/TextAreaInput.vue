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
        <!-- TODO: Expose rows as a prop... -->
        <textarea
          :rows="rows" 
          v-model="internalValue"
          class="form-textarea"
          type="text"
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
  watch:{
    internalValue(val){
      this.onChanged(val);
    },
    value(value){
      if(!this.internalValue) this.internalValue = value;
    }
  },
  mounted() {
    this.internalValue = this.value;
  },
  methods:{
    emitOnChange(){
      this.onChanged();
    }
  }
}
</script>