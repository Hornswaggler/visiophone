<template>

    <div class="tos-page">
        <p>TOS</p>
        <p>TOS</p>
        <p>TOS</p>
        <p>TOS</p>
        <p>TOS</p>
        <p>TOS</p>
        <p>TOS</p>
        </div>

</template>

<script>
import { mapState } from 'vuex';
import LandingPage from '../../layout/LandingPage.vue';

export default {
    name: 'TOS',
    components: {
        LandingPage
    },
    computed:{
    ...mapState('user', ['authenticated']),
    ...mapState('app', ['targetUrl'])
  },
}

</script>