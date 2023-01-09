<template>
  <div style="height:100%;width:100%;display: flex;flex-direction: column;">
    <div class="vp-input form-input">
      <div
        class="vp-input-container"
      >
        <div class="vp-input-title-container">
          <div class="vp-input-title">
            <slot
              name="title"
            />
          </div>
        </div>
        <div class="vp-input-body">
          <slot name="input" />
        </div>
      </div>
    </div>
    <div
      v-for="error in errors[fieldName]"
      :key="error.id"
      style="color:#c13809;font-size:0.7em;text-align: left;"
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
    hasValidations(){
      return ;
    },
    async updateState(newValue){
      await this.$store.dispatch('form/setField', {field: this.fieldName, value: newValue})
      this.$store.dispatch('form/validateField', {field: this.fieldName});
    },
  }
}
</script>

<style lang="scss">

.vp-input-container {
  display: flex;
  position:relative;
  flex: 1;
}

.vp-input-title-container {
  position:absolute;
  top:0;
  left:0;
  display:flex; 
  justify-content: flex-start;
  align-content: flex-start;

  .vp-input-title {
    margin-top: -0.85em;
    margin-left: 1em;
    height:1em;
    color:white;
    font-size: 0.8em;
    opacity:0.8;
  }
}

.vp-input-body {
  font-size: var(--vp-form-text-size);
  background-color: var(--vp-input-background-color);
  flex:2;
  display: flex;
  flex-direction:column;
  min-height: var(--vp-input-min-height);
  font-family: "VCR_OSD_MONO";
}
</style>