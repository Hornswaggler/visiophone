<template>
  <div 
    class="sortable-table-cell"
    @click="onClick"
  >
      <div class="sortable-table-cell-content">
        <slot />
      </div>
  </div>
</template>
<script>
export default {
  name:'FormSortableTableCell',
  props:{
    onClick:{
      type: Function,
      default: () => {}
    }
  }
}
</script>
