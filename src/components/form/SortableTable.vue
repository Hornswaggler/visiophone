<template>
  <div
    class="sortable-table"
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