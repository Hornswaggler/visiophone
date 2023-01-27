<template>
  <div
    class="form-panel"
  >
    <div
      class="form-panel-header"
      @click="onTogglePanelClicked"
    >
      <slot style="display: inline-block;" name="header"></slot>
    </div>
    <div
      ref="collapsiblePanelContent"
      :style="{height: clientHeight, opacity: collapsedInternal ? 0 : 1 }"
      class="form-panel-content add-sample-panel "
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollapsiblePanel',
  data: () => ({
    collapsedInternal: false,
    clientHeight: 'initial',
  }),
  props:{
    collapsed: {
      type: Boolean,
      default: false
    }, 
    onChanged: {
      type: Function,
      default: () => {}
    }
  },
  watch:{
    collapsed(newValue) {
      if(newValue){
        this.onCollapse()
      } else {
        this.onExpand();
      }
    }
  },
  mounted(){
    this.collapsedInternal = this.collapsed;
  },

  methods: {
    onExpand(){
      this.clientHeight = 'initial';
      this.collapsedInternal = false;
    },
    onCollapse(){
      this.clientHeight = 0;
      this.collapsedInternal = true;
    },
    onTogglePanelClicked() {
      if(!this.collapsedInternal) {
        this.onCollapse();
      } else {
        this.onExpand();
      }
      this.onChanged(this.collapsedInternal);
    }
  }
}
</script>