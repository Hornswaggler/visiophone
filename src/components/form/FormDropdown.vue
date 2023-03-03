<template>
  <div
    class="form-dropdown"
    :ref="referenceName"
    :style="{ 
      top: clientY, 
      left: clientX,
      width: itemWidth,
      zIndex
    }"
  >
    <div class="flex flex-column form-dropdown-content">
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

export default {
  name:'FormDropDown',
  data: () => ({
    showInternal: false,
    opacityMax: 0.78,
    opacityMin: 0,
    animating:false,
    referenceName: REF_DROPDOWN,
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