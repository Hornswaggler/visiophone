<template>
  <div 
    class="form-image"
    :style="{backgroundImage: `url('${url}')`}"
  ></div> 
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

<style lang="scss">
.form-image {
  border-radius:16px;
  height:6.5em;width:6.5em;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>