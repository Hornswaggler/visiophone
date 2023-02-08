<template>
  <div class="page-footer-container">
    <div
      v-for="option in sideNavigationItemsForUser"
      :key="option._id"
      @click="onMenuItemSelected(option)"
    >
      <form-icon
        :icon="option.icon"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import FormIcon from '../form/FormIcon.vue';

export default {
  name:'PageFooter',
  components:{
    FormIcon
  },
  props:{
    menuItems:{
      type: Array,
      default: () => {}
    }
  },
  computed: {
    ...mapState('app',['sideNavigationMenuItems', 'sideNavigationIndex']),
    ...mapGetters('user',['stripeAccountStatus']),

    sideNavigationItemsForUser(){
      return this.sideNavigationMenuItems
        .filter(m =>  m.accountStatus.includes(this.stripeAccountStatus));
    }
  },
  methods:{
    navigate(slug){
      this.$router.push(slug);
    },
    onMenuItemSelected({id,slug}) {
      if(this.sideNavigationIndex !== id) {
        this.$store.commit('app/setSideNavigationIndex', id )
        this.$router.push(slug);
      }
      this.changeHandler();
    },
  }
}
</script>
