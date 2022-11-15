<template>
  <div>HI</div>
</template>

<script>
import {axios, securePostJson} from '@/axios';
import { mapState } from 'vuex';

export default {
  name: 'UserStripeStandardReturn',
  computed:{
    ...mapState('user', ['stripeId'])
  },
  mounted(){
    const {stripeId} = this;
    console.log('Returned from stripe, authorizing user');
    securePostJson(axios, {stripeId}, {slug: 'provision_stripe_standard_return'});
  }
}
</script>
<style>
</style>