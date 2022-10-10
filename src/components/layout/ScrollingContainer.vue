<template>
  <div>
    <div>
      <slot name="header" />
    </div>
    <div
      ref="scrollingContainer"
      class="scrollbar"
    >
      <div
        class="scrolling-container flex flex-column"
      >
        <slot name="scrolling-content" />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { debounce } from 'vue-debounce'

export default {
  name: 'ScrollingContainer',
  data: () => ({
    debounce: debounce((callback, val) => callback(val), 200)
  }),
  computed:{
    //TODO: This should be a prop
    ...mapState('sample',['nextResultIndex'])
  },
  props:{
    onScrollLimitReached:{
      type: Function,
      default: () => {},
    }
  },
  mounted() {
    this.$refs.scrollingContainer.onscroll = this.onScroll;
  },
  methods:{
    onScroll(){
      this.debounce(this.loadMoreSamples);
    },
    loadMoreSamples(){
      const { scrollHeight , scrollTop , clientHeight } = this.$refs.scrollingContainer;

      if(scrollHeight - scrollTop - clientHeight < 1  ) {
        this.onScrollLimitReached();
      }
    }
  }
}
</script>

<style lang="scss">
.scrolling-container {
  padding: 1em;
  justify-content: flex-start;
}

.scrollbar
{
  border-radius:6px;
  flex:1;
  display:flex;
  flex-direction: column;
  background-color: rgba(33, 35, 35, 0.9);
  overflow-y:auto;

  &::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: rgb(17, 17, 17);
  }

  &::-webkit-scrollbar
  {
    width: 12px;
    background-color: black;
  }

  &::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }
}
</style>