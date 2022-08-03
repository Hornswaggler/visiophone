<template>
  <div
    class="flex flex-column"
  >
    <sample-card
      v-for="sample in samples"
      :key="sample._id"
      :sample="sample"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import SampleCard from './SampleCard.vue';

const bufferLimit = 10;

export default {
  name:'SampleSearch',
  components:{SampleCard},
  data: () => ({
    page: 0,
    bufferIndex:0,
  }),
  computed:{
    ...mapGetters('sample', ['sampleArray']),
    ...mapState('sample', ['isLoaded']),
    samples(){
      const {sampleArray, bufferIndex, bufferRemaining} = this;
      const length = bufferRemaining < bufferLimit ? bufferRemaining : bufferLimit; 
      return sampleArray.slice(bufferIndex, length);
    },
    bufferLength(){
      return this.sampleArray.length;
    },
    bufferRemaining(){
      return this.sampleBufferLength - this.bufferIndex;
    }
  },
  async mounted() {
    if(!this.isLoaded){
      try{
        await this.$store.dispatch(
          'sample/search',
          {page: this.page});
      }finally{
        this.$store.dispatch('sample/setIsLoaded', true);
      }
    }
  },
}
</script>

<style>

</style>