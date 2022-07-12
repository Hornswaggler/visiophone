<template>
<div 
  class="flex align-center" 
  :style="{fontSize: `${iconSize}`}">
  <slot name="content"></slot>
  <font-awesome-icon 
    class="form-icon" 
    :icon="icon" 
  />
</div>
</template>
<script>

// TODO: standardize Font Sizes
export default {
  name: 'FormIcon',
  props:{
    iconSize:{
      type: String,
      default: '1.5em',
    },
    icon: {
      type: String,
      default:'fas fa-play'
    }
  }
}
</script>
<style>
.form-icon {
  cursor:pointer;
}
</style>