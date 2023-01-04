<template>
  <div class="form-input-base-container">
    <div class="form-input-base">
      <div
        class="form-input-container"
      >
        <div class="form-input-title-container">
          <div class="form-input-title">
            <slot name="title" />
          </div>
        </div>
        <div class="form-input-body-container">
          <slot name="input" />
        </div>
      </div>
    </div>
    <div
      v-for="error in errors[fieldName]"
      :key="error.id"
      class="form-input-error"
    >
      {{error.msg}}
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
    blurred: {
      type: Boolean,
      default: false
    },
    fieldName: {
      type: String,
      default: ''
    },
  },
  computed:{
    ...mapState('form', ['errors']),
    ...mapGetters('form', ['currentForm']),
    validations(){
      return this.currentForm[this.title];
    }
  },
  mounted() {
    this.$watch('value', async newValue => {
      this.updateState(newValue);
    });
    this.$watch('blurred', () => this.updateState(this.value));

    Object.assign(this.validInternal, {
      ...defaultValidations(),
      ...this.validations
    });
  },
  methods: {
    async updateState(newValue){
      await this.$store.dispatch('form/setField', {field: this.fieldName, value: newValue})
      this.$store.dispatch('form/validateField', {field: this.fieldName});
    },
  }
}
</script>