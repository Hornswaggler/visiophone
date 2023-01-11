<template>
  <div class="responsive-layout">
    <div class="responsive-margin" />

    <div class="responsive-layout-body">
      <slot name="side-panel" />
      <slot name="content" />
    </div>

    <div class="responsive-margin" />
  </div>
</template>
<script>
export default {
  name: 'ResponsiveLayout',
}
</script>