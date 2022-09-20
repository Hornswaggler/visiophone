<template>
  <ol class="component-state-view">
    <li
      v-for="{id, value, key} in displayState"
      :key="id"
    >
      {{ key }}: {{ value }}
    </li>
  </ol>
</template>

<script>
export default {
  name:'ComponentState',
  props:{
    component:{
      type: Object,
      default: () => {}
    }
  },
  computed:{
    displayState() {
      const result = Object.keys(this.component._data).map((key, id) => ({
        value: this.component._data[key],
        key,
        id
      }));

      return result;
    }
  }
}
</script>

<style lang="scss">
.component-state-view {
  z-index: 1;
  display:flex;
  flex-direction:column;
}
</style>