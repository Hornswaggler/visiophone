<template>
  <div
    class="flex flex-column"
    style="display:flex; flex-direction: column;"
  >
    <sample-card
      v-for="sample in samples"
      :key="sample.id"
      :sample="sample"
      style=""
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
    console.log('About to retrieve samples...');
    this.samples = await this.$store.dispatch('sample/getAll');
  },
}
</script>

<style>

</style>