<template>
  <movable :style={zIndex} @start="onMouseDown" posTop="100" posLeft="200" style="justify-content:center;align-items:flex-start;height:25em;width:25em; border-radius: 75px;display:flex;font-family: 'Helvetica', 'Arial', sans-serif;color:white;" class="bubble">
    <div style="position:relative;padding-top:1.75em;z-index:2;width:100%;height:100%;"
    >
      <visio-man>
        <div style="position:absolute;padding-left:33%;display:flex;justify-content:center">
          <progress-bar
            style="flex:1;"
            :options="options"
            :value="value"
          />
        </div>
      </visio-man>

      <div style="margin-top:50px;flex:1;padding-top: 10px;"></div>
      
    </div>
  </movable>
</template>
<script>
import VisioMan from './VisioMan.vue';
import { mapState, mapActions } from 'vuex'

export default {
  name:"DragBubble",
  components:{
    VisioMan
  },
  computed: {
    ...mapState('dragBubble', ['draggableMap']),
    zIndex(){
      return this.draggableMap[this.uuid] && this.draggableMap[this.uuid].zIndex;
    }
  },
  async mounted() {
    this.uuid = await this['dragBubble/registerDraggable']();
    console.log('UUID:', this.uuid);
  },
  data: () => ({
    uuid: '',
    value:50,
    isMouseDown:false,
    offset:{x: 0, y: 0},
    position: {x: 0, y: 0},
    options: {
      text: {
        color: '#FFFFFF',
        shadowEnable: true,
        shadowColor: '#000000',
        fontSize: 14,
        fontFamily: 'Helvetica',
        dynamicPosition: false,
        hideText: false
      },
      progress: {
        color: '#2dbd2d',
        backgroundColor: '#333333',
        inverted: false
      },
      layout: {
        height: 35,
        width: 140,
        verticalTextAlign: 61,
        horizontalTextAlign: 43,
        zeroOffset: 0,
        strokeWidth: 30,
        progressPadding: 0,
        type: 'line'
      }
    }
  }),
  methods: {
    ...mapActions(['dragBubble/registerDraggable', 'dragBubble/onDraggableSelected']),
    onMouseDown({x,y}) {
      console.log('MouseDown');
      this['dragBubble/onDraggableSelected'](this.uuid);
      this.isMouseDown = true;
      this.position = {x,y};

    },
    onMouseMove(event){
      // console.log(event.x, event.y);
      if(this.isMouseDown){
        console.log(`move: ${event.x}, ${this.offset.x}, ${event.offsetX}}`);

        // const previousPosition = { x: this.position.x, y: this.position.y };
        //const previous



        // this.offset.x += this.previousPosition >= event.x;
        // this.offset.y += this.previousPosition

        // if(event.x)

        this.offset.x = event.offsetX ;

        this.position.x = event.x;
        this.position.y = event.y;
      }
      
    },
    onMouseUp() {
      console.log('asdfasdfasdf');
      // this.isMouseDown = false;
    },
    onMouseLeave() {
      // this.isMouseDown = false;
    }
  }
}

</script>
<style lang="scss">
.bubble {
  background: rgb(55,55,55);
  background: linear-gradient(0deg, rgba(55,55,55,1) 0%, rgba(191,191,191,1) 100%);
}
</style>