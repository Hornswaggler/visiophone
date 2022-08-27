<template>
  <div
    class="flex sample-search-container"
    :class="{isCollapsed}"
  >
    <sample-detail
      v-for="sample in sampleArray"
      :key="sample._id"
      :sample="sample"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import SampleDetail from './SampleDetail.vue';
import {SORT_TYPES} from '@/store/modules/sample';

export default {
  name:'SampleSearch',
  components:{SampleDetail},
  data: () => ({
    page: 0,
    bufferIndex:0,
  }),
  computed:{
    ...mapGetters('sample', ['sampleArray', '']),
    ...mapState('sample', ['isLoaded', 'sortType']),
    ...mapState('user', ['apiToken']),
    isCollapsed(){
      return this.sortType === SORT_TYPES.GROUP;
    },
    isListTypeSelected(){
      return this.sortType === SORT_TYPES.LIST;
    },
    isGroupTypeSelected(){
      return this.sortType === SORT_TYPES.GROUP;
    },
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
        const {page, apiToken:{accessToken: token}} = this;
        await this.$store.dispatch(
          'sample/initialize',
          {page, token});
      }finally{
        this.$store.dispatch('sample/setIsLoaded', true);
      }
    }
  },
}
</script>

<style lang="scss">
.sample-search-container {
  justify-content: flex-start;
  transition: all 0.2s;
  flex-direction: column;
  flex-wrap: wrap;
  &.isCollapsed {
    flex-direction: row;
  }
}

</style>