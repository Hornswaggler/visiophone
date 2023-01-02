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
  height: var(--vp-cover-art-hw);
  width: var(--vp-cover-art-hw);
  min-height:var(--vp-cover-art-hw);
  min-width:var(--vp-cover-art-hw);
  border-radius:8px;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;

  &.expanded {
    height: var(--vp-cover-art-hw-expanded);
    width: var(--vp-cover-art-hw-expanded);
  }

}
</style>