<template>
  <div 
    class="landing-page"
  >
  </div>
</template>
<script>
export default {
  name: 'StripeRedirect',
  mounted(){
    this.$store.dispatch('user/logon');
  }
}
</script>

<style>

</style>