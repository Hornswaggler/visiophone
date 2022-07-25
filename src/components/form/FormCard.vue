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
  margin-left:1em;
  background-color:black;
  display:flex;
  border-radius: 8px;
  flex:1;
  overflow-x:hidden;
}

</style>