<template>  
  <div
    class="icon-button"
    :class="{selected}"
    @click="onClickHandler"
  >
    <font-awesome-icon 
      icon="fas fa-grip" 
      style="margin-bottom:-0.666em;"
    />
    <font-awesome-icon icon="fas fa-grip" />
  </div>
</template>

<script>
export default {
  name:'BootlegListSortIcon',
   props:{
    onClick:{
      type: Function,
      default: () => {},
    },
    selected:{
      type: Boolean,
      default: false
    }
  },
  methods:{
    onClickHandler(){
      this.onClick();
    }
  }
};

</script>