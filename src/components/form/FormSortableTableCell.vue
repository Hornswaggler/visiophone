<template>
  <div class="sortable-table-cell">
    <div class="table-cell-overflow">
      <div class="table-cell-content">
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
<style lang="scss">
.sortable-table-cell {
  height: var(--vp-cover-art-hw);
  text-align:left;
  font-size:large;
  position: relative;
  width:100%;
  overflow:hidden;

  .table-cell-overflow {
    white-space:nowrap;
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
  }

  .table-cell-content {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

}
</style>