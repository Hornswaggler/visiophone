<template>
  <div>Log me out</div>
</template>
<script>
export default {
  name: 'Logout',
  mounted(){
    console.log('about to log out');
    this.$nextTick(() => {
      this.$store.dispatch('user/logoutRedirect');
    });
  }
}
</script>
<style lang="scss">
</style>