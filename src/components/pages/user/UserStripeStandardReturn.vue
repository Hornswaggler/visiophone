<template>
  <div></div>
</template>

<script>
export default {
  name: 'UserStripeStandardReturn',
  mounted() {
    this.$store.dispatch('user/handleProvisionReturn');
    this.$router.push('/user/settings');
  }
}
</script>
<style>
</style>