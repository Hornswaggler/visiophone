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
  padding: 0.5em 1em;
  background-image: linear-gradient(233deg, #44444454, #22222270);
  height: var(--vp-cover-art-hw);
  width: var(--vp-cover-art-hw);

  display:flex;
  border-radius: 8px;
  flex:1;
  overflow-x:hidden;
}

</style>