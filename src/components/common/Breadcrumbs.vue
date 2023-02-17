<template>
  <div class="flex align-center">
    <span 
      v-for="({id, slug, title}, index) in breadcrumbs"
      :key="id"
      class="breadcrumb"
    >
      <span 
        v-if="index !== 0"
      >
        {{title}}
      </span>
      <span
        v-else
        @click="goToSlug(slug)"
      >
        {{title}}
      </span>
    </span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Breadcrumbs',
  computed: {
    ...mapGetters('nav', ['breadcrumbs']),
  },
  methods:{ 
    goToSlug(slug){
      this.$router.push(slug);
    }
  }
}
</script>
<style lang="scss">
.breadcrumb{
  font-size: 0.7rem;
  &:not(:first-child) {
    padding-left: 0.25rem;
  }

  &:not(:last-child){
    opacity: 0.8;
    &::after{
      content: '>'
    }
  }

  &:last-child{
    font-weight: bold;
    font-size: 0.8rem;
  }

  &:not(:last-child){
    cursor: pointer;
  }
}
</style>