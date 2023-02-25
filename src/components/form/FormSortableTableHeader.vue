<template>
  <div class="sortable-table-header">
    <div
      v-for="(column, index) in tableDefinition.columns"
      :key="column.id"
      class="sortable-table-header-column noselect"
      :style="{ flex: column.ratio }"
      :class="{ selected }"
      @click="handleColumnClicked(column, index)"
    >
      <div class="flex align-center">
        <div v-if="column.show">
          {{ column.name }}
        </div>
        <div v-else>
          &nbsp;
        </div>
      </div>
      <div
        class="sortable-table-header-sort-options"
        :class="{ selected: index === selectionIndex }"
      >
        <form-icon
          :style="{opacity: isAsc ? '0' : '1'}"
          icon="fas fa-caret-up"
          class="sortable-table-header-form-icon"
          :class="{ selected: index === selectionIndex }"
        />
        <form-icon
          :style="{opacity: isAsc ? '1' : '0'}"
          icon="fas fa-caret-down"
          class="sortable-table-header-form-icon"
          :class="{ selected: index === selectionIndex }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormIcon from './FormIcon.vue'
export default {
  components: { FormIcon },
  name:'FormSortableTableHeader',
  data: () => ({
    selectionIndex:-1,
    isAsc: false
  }),
  props: {
    tableDefinition: {
      type: Object,
      default: () => {}
    },
    onColumnClicked: {
      type: Function,
      default: () => {}
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    handleColumnClicked(column, index){
      if(this.selectionIndex === index) {
        this.isAsc = !this.isAsc;
      } else {
        this.selectionIndex = index;
        this.isAsc = true;
      }
      this.onColumnClicked(column);
    }
  }
}
</script>