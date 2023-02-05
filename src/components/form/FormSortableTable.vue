<template>
  <div
    class="sortable-table"
    :class="{isListView}"
  >
    <div
      v-for="row in data"
      :key="row._id"
      class="sortable-table-row"
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
    isListView:{
      type: Boolean,
      default: false
    }
  },
}
</script>