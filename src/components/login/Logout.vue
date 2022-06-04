<template>
  <div>Log me out</div>
</template>
<script>
export default {
  name: 'Logout',
  mounted(){
    this.$nextTick(() => {
      this.$store.dispatch('user/logoutRedirect');
    });
  }
}
</script>
<style lang="scss">
</style>