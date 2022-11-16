<template>
  <div class="form-card">
    <div class="top-plane" />
    <div class="bottom-plane" />
    <slot name="content" />
  </div>
</template>

<script>
export default {
  name:'FormCard'
}
</script>

<style lang="scss">

.form-card {
  background-image: var(--vp-form-card-background-image);
  display:flex;
  border-radius: 8px;
  flex:1;
  overflow-x: hidden;
}

</style>