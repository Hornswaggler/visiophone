<template>
<CenteredResponsiveLayoutVue>
  <template v-slot:content>
    <div class="sample-search-container">
      <sample-search-header></sample-search-header>
      <scrolling-container>
        <template v-slot:scrolling-content>
          <sample-card
            v-for="sample in samples" 
            :key="sample.id"
            :sample="sample"
          ></sample-card>
        </template>
      </scrolling-container>
    </div>
  </template>
</CenteredResponsiveLayoutVue>
</template>
<script>
import {mapGetters} from 'vuex';
import ScrollingContainer from '../layout/ScrollingContainer.vue';
import CenteredResponsiveLayoutVue from '../layout/CenteredResponsiveLayout.vue';
import SampleSearchHeader from './SampleSearchHeader.vue';
import SampleCard from './SampleCard.vue';

export default {
  components: { 
    ScrollingContainer,
    CenteredResponsiveLayoutVue,
    SampleSearchHeader,
    SampleCard
  },
  name: 'SampleSearch',
  data: () => ({
    samples: [],
  }),
  computed:{
    ...mapGetters('user',['userName']),
  },
  async mounted(){
    this.samples = await this.$store.dispatch('sample/getAll');
  }
}
</script>
<style lang="scss">
.sample-search-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.sample-search-header {
  height:5.5em;
  display:flex;
  justify-content: center;
  align-items:center;
  padding: 1em;
}

.navigation-button {
  margin:0.5em 1em;
  background-color:transparent;
  cursor:pointer;
  transition: all 0.5s ease-in-out;
  border-radius: 10px;

  &:hover {
    background-color:white;
    color:black;
    scale: 1.25;
  }

  &.selected {
    background-color:rgb(17, 17, 17);
  }
}
</style>