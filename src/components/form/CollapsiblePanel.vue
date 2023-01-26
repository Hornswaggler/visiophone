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
      :style="{height: clientHeight, opacity: collapsed ? 0 : 1 }"
      class="form-panel-content add-sample-panel ">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollapsiblePanel',
  data: () => ({
    collapsed: false,
    clientHeight: 'initial',
    lastClientHeight: 'initial'
  }),

  mounted(){
    this.$refs['collapsiblePanelContent'].addEventListener('transitionend', this.onTransitionEnd);

  },
  beforeDestroy(){
    this.$refs['collapsiblePanelContent'].removeEventListener('transitionend', this.onTransitionEnd);
  },
  methods: {
    onTransitionEnd(){
      console.log('TRANSITION ENDED: ', this.collapsed);
      if(!this.collapsed){
        this.clientHeight = 'initial'
      }   

    },
    onTogglePanelClicked(){

      if(!this.collapsed) {
        this.collapsed = true;
        this.clientHeight = `${this.$refs['collapsiblePanelContent'].clientHeight}px`;
        this.lastClientHeight = this.clientHeight;

        setTimeout(()=>{
          this.clientHeight = '0px';
        }, 1);

      } else {
        this.collapsed = false;
        this.clientHeight = this.lastClientHeight;
      }
    }
  }
}
</script>

<style>

</style>