<template>
  <div class="scrolling-container">
    <div
      ref="header"
      :style="{ height: headerHeight }"
      class="scrolling-container-header"
    >
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
    debounce: debounce((callback, val) => callback(val), 200),
    loaded: false
  }),

  computed: {
    //TODO: This should be a prop
    ...mapState('sample',['nextResultIndex']),
    headerHeight() {
      if(this.loaded && this.$refs['header'].children.length > 0){
        return 'initial';
      }
      return '0';
    }
  },

  props:{
    onScrollLimitReached:{
      type: Function,
      default: () => {},
    }
  },

  mounted() {
    this.$refs.scrollingContainer.onscroll = this.onScroll;
    this.loaded = true;
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