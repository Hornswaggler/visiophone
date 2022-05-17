<template>
  <FormInput>
    <template v-slot:title>
      tags
    </template>
    <template v-slot:input>
      <div class="vp-tag-editor">
        <input class="vp-input vp-tag-editor-input" type="text"/>
      </div>
    </template>
  </FormInput>
</template>
<script>
import FormInput from '@/components/form/FormInput';

export default {
  name: 'TagEditor',
  components: { FormInput },
  props:{
    title: {
      type: String,
      default: '',
    },
  }
}
</script>
<style lang="scss">
.vp-tag-editor {
  flex:1;
  display:flex;
  justify-content: flex-start;
  align-items: center;
  border: solid 1px white;
  padding:0;
  width: 100%;
}

.vp-tag-editor-input {
width:100%;
background-color:transparent;
border:0;
}
</style>