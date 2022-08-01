<template>
  <div
    class="flex flex-column"
  >
    <sample-card
      v-for="sample in samples"
      :key="sample.id"
      :sample="sample"
    />
  </div>
</template>

<script>
import SampleCard from './SampleCard.vue';

export default {
  name:'SampleSearch',
  components:{SampleCard},
  data: () => ({
    samples: [],
  }),
  async mounted() {
    this.samples = await this.$store.dispatch('sample/getAll');
  },
}
</script>

<style>

</style>