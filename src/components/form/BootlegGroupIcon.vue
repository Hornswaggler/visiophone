<template>  
  <div
    class="icon-button"
    :class="{selected}"
    @click="onClickHandler"
  >
    <font-awesome-icon 
      icon="fas fa-grip" 
      style="margin-bottom: -1.025rem;"
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