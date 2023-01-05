<template>
  <div
    class="icon-button"
    :class="{selected}"
    @click="onClickHandler"
  >
    <font-awesome-icon 
      icon="fas fa-grip-lines"
      style="margin-bottom:-0.5em;"
    />
    <font-awesome-icon icon="fas fa-grip-lines" />
  </div>
</template>

<script>
export default {
  name:'BootlegListSortIcon',
  props:{
    onClick:{
      type: Function,
      default: () => {}
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    onClickHandler(){
      this.onClick();
    }
  }
}
</script>