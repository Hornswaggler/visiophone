<template>
  <div class="sortable-column-row">
    <div
      v-for="column in tableDefinition.columns"
      :key="column._id"
      class="sortable-column"
      :style="{ flex: column.ratio }"
    >
      <slot :name="column.name" />
    </div>
  </div>
</template>

<script>
export default {
  name:"SortableTableRow",
  props:{
    tableDefinition:{
      type: Object,
      default: () => {}
    }
  }
}
</script>