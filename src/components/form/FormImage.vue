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

<style lang="scss">
.form-image {
  border-radius:8px;
  min-height:var(--vp-cover-art-hw);
  min-width:var(--vp-cover-art-hw);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>