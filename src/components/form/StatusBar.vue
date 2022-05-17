<template>
<div>
<FormInput>
  <template v-slot:info>
    <div>{{info}}</div>
  </template>
  <template v-slot:input>
    <div class="vs-statusbar">
      <div
        class="vs-statusbar-percent-complete"
        :style="{width: `${percentComplete}%`}"
      ></div>
    </div>  
  </template>
</FormInput>
</div>
</template>
<script>
import FormInput from '@/components/form/FormInput';

export default {
  name: 'StatusBar',
  components:{ FormInput },
  props: {
    percentComplete: {
      type: Number,
      default: 0,
    },
    info:{
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss">
.vs-statusbar {
  width:100%;
  height:1em;
  border: solid 1px lightgrey;
  display:flex;

  .vs-statusbar-percent-complete {
    height:100%; 
    background-color:lightgrey;
    transition: all 1s ease-in-out;
  }
}

</style>