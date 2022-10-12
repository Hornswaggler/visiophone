<template>
  <div class="sortable-column-row form-card">
    <div
      v-for="column in tableDefinition.columns"
      :key="column._id"
      class="sortable-column"
      :class="{expanded: !isCollapsed}"
      :style="{flex: column.ratio}"
    >
      <slot :name="column.name" />
    </div>
  </div>
</template>

<script>
//THIS IMPORT MUST BE INCLUDED
import FormCard from './FormCard';

export default {
  name:"SortableTableRow",
  props:{
    tableDefinition:{
      type: Object,
      default: () => {}
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style lang="scss">
.sortable-column {
  height:100%;
  width:100%;
}
</style>