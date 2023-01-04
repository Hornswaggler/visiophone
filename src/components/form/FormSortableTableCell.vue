<template>
  <div class="sortable-table-cell">
    <div class="sortable-table-cell-overflow">
      <div class="sortable-table-cell-content">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'FormSortableTableCell'
}
</script>
