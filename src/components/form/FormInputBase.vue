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
      :class="{hasError: ((errors[fieldName]) || []).length > 0}"
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
import {mapState, mapGetters} from 'vuex';

const defaultValidations = () => ({
  required: false
});

export default {
  name: 'FormInputBase',
  data: () => ({
    validInternal: defaultValidations(),
  }),
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
  },
  computed:{
    ...mapState('form', ['errors']),
  },
}
</script>