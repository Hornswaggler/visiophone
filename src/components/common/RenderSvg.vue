<template>
  <div
    :class="{...classComputed}"
    @click="onClick"
    ref="svg"
  ></div>
</template>

<script>
export default {
  name: 'RenderSvg',
  props: {
    elementClasses: {
      type: Array,
      default: () => []
    },
    rawSVG: {
      type: String,
      default: ''
    },
    onClick:{
      type: Function,
      default: () => {}
    }
  },
  computed: {
    classComputed() {
      return this.elementClasses.reduce((acc, className) => {
        acc[`${className}`] = true;
        return acc;
      }, {})
    }
  },
  mounted() {
    const container = this.$refs['svg'];
    const el = document.createElementNS('http://www.w3.org/2000/svg','g');
    container.appendChild(el);
    el.outerHTML= this.rawSVG;
  }
}
</script>
