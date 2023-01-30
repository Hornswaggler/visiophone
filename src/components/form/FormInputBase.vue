<template>
  <div class="form-input-base-container">
    <div class="form-input-title">
        <slot name="title" />
      </div>
    <div class="form-input-base">
      <div class="form-input-container">
        <div class="form-input-body-container">
          <slot name="input" />
        </div>
      </div>
    </div>

    <div 
      class="form-input-error-container"
      :class="{hasError}"
    >
      <div
        v-for="error in errors[fieldName]"
        :key="error.id"
        class="form-input-error"
      >
        {{error.msg}}
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';

const defaultValidations = () => ({
  required: false
});

export default {
  name: 'FormInputBase',
  data: () => ({
    validInternal: defaultValidations(),
  }),
  computed: {
    ...mapState('form', ['errors']),
    hasError(){
      if(this.errors != null && this.fieldName != null && this.errors[this.fieldName] != null){
        return ((this.errors[this.fieldName]) || []).length > 0;
      }
      return [];
    }
  },
  props:{
    title: {
      type: String,
      default: ''
    },
    value:{
      type:String,
      default: ''
    },
    fieldName: {
      type: String,
      default: ''
    },
  }
}
</script>