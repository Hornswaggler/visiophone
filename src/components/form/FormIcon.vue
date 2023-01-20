<template>
  <div 
    class="flex align-center" 
  >
    <slot name="pre-content" />
    <font-awesome-icon 
      class="form-icon"
      :icon="icon"
    />
    <slot name="post-content" />
  </div>
</template>
<script>

// TODO: standardize Font Sizes
export default {
  name: 'FormIcon',
  props:{
    iconSize:{
      type: String,
      default: 'var(--vp-input-min-height)',
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