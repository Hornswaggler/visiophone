<template>
<div 
  class="flex align-center" 
  :style="{
    fontSize: `${iconSize}`,
    color: `${color}`
  }">
  <slot name="pre-content"></slot>
  <font-awesome-icon 
    class="form-icon" 
    :icon="icon" 
  />
  <slot name="post-content"></slot>
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
    },
    color: {
      type: String,
      default: 'white'
    }
  }
}
</script>
<style>
.form-icon {
  cursor:pointer;
}
</style>