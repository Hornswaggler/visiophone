<template>
  <div 
    @click="e => {onClick(e)}"
    class="form-image"
    :style="{backgroundImage: `url('${url}')`}"
  /> 
</template>

<script>
export default {
  name:'FormImage',
  props:{
    url: {
      type: String,
      default: 'CaptAhab.jpg',
    },
    onClick:{
      type: Function,
      default: () => {}
    }
  }
}
</script>