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
      <div class="vp-text-area-input">
        <textarea
          v-model="internalValue"
          class="vp-textarea"
          rows="2" 
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
<style lang="scss">
.vp-textarea {
  width:100%;
  height:100%;
  background-color:transparent;
  color:white;
  padding: var(--vp-input-padding);
  box-sizing: border-box;
  font-size: var(--vp-form-text-size);
}

.vp-text-area-input {
  flex:1;
  display:flex;
  justify-content: flex-start;
  align-items: center;
  padding:0;
  width: 100%;
}
</style>
