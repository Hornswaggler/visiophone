<template>
  <div 
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
  }
}
</script>