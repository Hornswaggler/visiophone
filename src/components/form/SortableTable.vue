<template>
  <div
    class="sortable-table-container"
    :class="{expanded: isCollapsed}"
  >
    <div
      v-for="row in data"
      :key="row._id"
      class="sortable-table-row"
      :class="{expanded: isCollapsed}"
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
  name:'SortableTable',
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
  justify-content: center;

  &.expanded {
    justify-content: initial;
    flex-direction: column;
  }

  .sortable-table-row {
    width: var(--vp-cover-art-hw);
    transition:all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    width: var(--vp-cover-art-hw-expanded);
    height:var(--vp-cover-art-hw-expanded);

    padding: 0.5em;

    &:hover {
      transform:scale(1.1);
    }

    &.expanded {
      width: 100%;
      height: 100%;
      padding: 0;
      &:hover {
        transform:none;
      }
      &:first-child{
        margin-top:0;
      }
    }

    margin-top:0.5em;
  }
  
}

</style>