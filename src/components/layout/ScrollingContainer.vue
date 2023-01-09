<template>
  <div class="scrolling-container">
    <div class="scrolling-container-header">
      <slot name="header" />
    </div>
    <div
      ref="scrollingContainer"
      class="scrolling-container-scrollable-content"
    >
      <div
        class="scrolling-container-content flex flex-column"
      >
        <slot name="scrolling-content" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from 'vue-debounce'

export default {
  name: 'ScrollingContainer',

  data: () => ({
    debounce: debounce((callback, val) => callback(val), 200)
  }),

  computed: {
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