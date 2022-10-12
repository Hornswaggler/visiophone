<template>
  <div class="page-footer-container">
    <div
      v-for="{id, icon, slug} in menuItems"
      :key="id"
      @click="navigate(slug)"
    >
      <form-icon
        :icon="icon"
      />
    </div>
  </div>
</template>
<script>
import FormIcon from '../form/FormIcon';

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
  methods:{
    navigate(slug){
      this.$router.push(slug);
    }
  }
}
</script>
<style lang="scss">
.page-footer-container {
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: space-around; 
}
</style>