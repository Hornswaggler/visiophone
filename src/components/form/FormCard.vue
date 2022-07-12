<template>
  <div class="form-card">
    <slot name="content"></slot>
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
  border-radius: 16px;
  flex:1;
  overflow-x:hidden;
}
</style>