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
  background-image: linear-gradient(233deg, #44444454, #22222270);

  display:flex;
  border-radius: 8px;
  flex:1;
  overflow-x:hidden;
}

</style>