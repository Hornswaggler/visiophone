<template>
  <div
    class="mouse-offset"
    :ref="referenceName"
    :style="{ 
      transform: `translate(${clientX}, ${clientY})`, 
      width: itemWidth,
      zIndex }"
  >
    <div class="flex flex-column form-dropdown-item-container" >
      <div
        @click="onItemClicked"
        class="form-dropdown-item"
        v-for="each in menuItemsComputed" 
        :key="each.id" 
        :style="{width, transform}"
      >
        <div class="form-dropdown-item-name"
          :style="{width:itemWidth}"
        >Log Out</div>
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
    opacityMax: 0.5,
    opacityMin: 0,
    animating:false,
    referenceName: REF_DROPDOWN,
    width: initialWidth,
  }),
  watch:{
    show(show) {
      this.$nextTick(() => {
        this.animating = true;
        this.showInternal=show;
        this.width=show ? this.itemWidth : initialWidth;
      })
    }
  },
  computed: {
    ...mapState('dropdown', ['show', 'itemWidth', 'clientX', 'clientY', 'onChanged', 'menuItems']),
    transform(){
      return `scale(${this.show?1:0})`;
    },
    zIndex(){
      return this.show?'200': '-1';
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
    async onItemClicked(e){
      e.stopPropagation();
      if(await this.$store.dispatch('user/logout')) {
        
        this.$router.push('landing-page');
      }
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
    padding:0;
    overflow:hidden;
    transition: width 0.25s, transform 0.25s;
    opacity: 0.9;
    cursor:pointer;
    background-color:grey;
    height:2em;
    display:flex;
    justify-content: center;
    align-items: center;
    color:white;

    &:hover{
      transform: scale(1.2);
      opacity: 1;
      z-index:1;
      background-color:rgb(189, 189, 189);
      color:#65FE00;
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