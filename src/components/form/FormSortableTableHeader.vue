<template>
  <div style="display:flex;">
    <div
      v-for="(column, index) in tableDefinition.columns"
      :key="column.id"
      class="sortable-table-header-column"
      :style="{flex: column.ratio}"
      :class="{ selected }"
      @click="handleColumnClicked(column, index)"
    >
      <div>
        <div v-if="column.show">
          {{ column.name }}
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
<style lang="scss">
.sortable-table-header-column {
  cursor:pointer;
  display:flex;
  justify-content: flex-start;
  background-color:rgba(0, 0, 0, 0.355);

  transition: all 250ms cubic-bezier(0.19, 1, 0.22, 1);
  &:hover {
    transform: scale(1.05);
    background-color:rgba(114, 114, 114, 0.463);
  }

  &.selected {

  }

  .sortable-table-header-sort-options {
    display:flex;
    flex-direction: column; 
    justify-content: center;
    padding-left:0.5em;
    opacity:0;
    transition: all 250ms cubic-bezier(0.075, 0.82, 0.165, 1);

    &.selected {
      opacity: 1;
    }

    &:hover{
      opacity: 0.8;
    }

    .sortable-table-header-form-icon {

      opacity:0;

      color: #a1a1a170;

      font-size:0.8em;
      height:25%;
      user-select: none;

      &:hover{
        color: #ffffffe1;
      }

      &.selected {
        opacity:1;
        color:rgba(255, 255, 255, 0.96);
      }
    }
  }

}
</style>