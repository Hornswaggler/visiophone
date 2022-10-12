<template>
  <div
    class="sortable-table-container"
    :class="{selected: isCollapsed}"
  >
    <div
      v-for="row in data"
      :key="row._id"
      class="sortable-table-row"
      :class="{selected: isCollapsed}"
      :style="{width: isCollapsed ? '100%' : '2em'}"
    >
      <slot
        name="row"
        :row="row"
      />
    </div>
  </div>
</template>

<script>
export default {
  name:'FormSortableTable',
  props:{
    data: {
      type: Array,
      default: () => []
    },
    isCollapsed:{
      type: Boolean,
      default: false
    },
    tableDefinition: {
      type: Object,
      default: () => {}
    }
  },
}
</script>

<style lang="scss">
.sortable-table-container {
  display:flex;
  flex-wrap: wrap;
  flex-direction: row;

  &.collapsed{
    flex-direction: column;
  }

  .sortable-table-row {
    width: var(--vp-cover-art-hw);
    transition:all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &.selected{
      width: calc(100%);
    }

    width:calc(100%);
    &:first-child{
      margin-top:0;
    }
    margin-top:0.5em;
  }
  
}

</style>