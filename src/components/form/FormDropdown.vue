<template>
  <div
    :ref="referenceName"
    class="mouse-offset"
    :style="{ 
      transform: `translate(${clientX}, ${clientY})`, 
      width: itemWidth,
      zIndex }"
  >
    <div class="flex flex-column form-dropdown-item-container">
      <div
        v-for="menuItem in menuItemsComputed"
        :key="menuItem.id" 
        class="form-dropdown-item"
        :style="{width: itemWidth, transform, opacity}"
        @click="((e) => onItemClicked(e, menuItem))"
      >
        <div
          class="form-dropdown-item-name"
          :style="{width: itemWidth}"
        >
          {{ menuItem.displayName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';
const REF_DROPDOWN = 'dropdownEl';
const initialWidth = '0';

export default {
  name:'FormDropDown',
  data: () => ({
    showInternal: false,
    opacityMax: 0.78,
    opacityMin: 0,
    animating:false,
    referenceName: REF_DROPDOWN,
    width: initialWidth,
  }),
  computed: {
    ...mapState('dropdown', ['show', 'itemWidth', 'clientX', 'clientY', 'onChanged', 'menuItems']),

    transform(){
      return `scale(${this.show?1:0})`;
    },

    zIndex(){
      return this.show|| (!this.show && this.animating) ? '200' : '-1';
    },

    opacity(){
      return `${(this.show?this.opacityMax:this.opacityMin)}`;
    },

    menuItemsComputed() {
      return Object
        .keys(this.menuItems)
        .reduce((menuItems, name, id) => {
          menuItems.push({
            id,
            ...this.menuItems[name],
            name
          });
          return menuItems;
        }, []);
    }
  },
  mounted() {
    this.showInternal=this.show;
    this.$refs[this.referenceName]
      .addEventListener('transitionend', this.onCssEvent);
  },

  beforeDestroy(){
    this.$refs[this.referenceName]
      .removeEventListener('transitionend', this.onCssEvent);
  },
  
  methods:{
    onCssEvent(e){
      this.animating = false;
    },
    async onItemClicked(e, item) {
      e.stopPropagation();
      item.handler(this);
      this.onChanged(false);
    },
  }
}
</script>
<style lang="scss">

.mouse-offset {
  position:fixed;
  display:flex;
  z-index:200;
}

.form-dropdown-item-name{
  word-break:keep-all;
  overflow:hidden;
}

.form-dropdown-item-container {
  width: 10em;
  align-items: center;
  .form-dropdown-item:nth-child(odd){
    background-color:rgb(158, 158, 158);
  }

  .form-dropdown-item {
    // border: solid 2px white;
    border-right: solid white 1px;
    border-left: solid white 1px;
    &:first-child{
      border-top: solid white 1px;
    }

    &:last-child{
      border-bottom: solid white 1px;
    }

    padding:0;
    overflow:hidden;
    transition: width 0.25s, color 0.2s, opacity 0.5s, transform 0.25s;
    opacity: 0.9;
    cursor:pointer;
    background-color:grey;
    height:2em;
    display:flex;
    justify-content: center;
    align-items: center;
    color:black;

    &:hover{
      transform: scale(1.2);
      opacity: 1;
      z-index:1;
      background-color:rgb(189, 189, 189);
      color:white;
    }

    &>*{
      display:block;
      position:absolute;
      overflow:hidden;
      word-break: keep-all;
    }
  }
}
</style>