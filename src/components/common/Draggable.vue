<template>
  <movable
    :style="{ zIndex }"
    @start="onStart"
    posTop="100"
    posLeft="200"
    style="
      justify-content: center;
      align-items: flex-start;
      height: 25em;
      width: 25em;
      border-radius: 75px;
      display: flex;
      color: white;
    "
    class="bubble"
  >
    <div
      style="
        position: relative;
        padding-top: 1.75em;
        z-index: 2;
        width: 100%;
        height: 100%;
      "
    >
      <visio-man>
        <div
          style="
            position: absolute;
            padding-left: 33%;
            display: flex;
            justify-content: center;
          "
        >
          <progress-bar style="flex: 1" :options="options" :value="value" />
        </div>
      </visio-man>

      <div style="margin-top: 50px; flex: 1; padding-top: 10px"></div>
    </div>
  </movable>
</template>
<script>
import VisioMan from "@/components/common/VisioMan.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "Draggable",
  components: {
    VisioMan,
  },
  computed: {
    ...mapState("draggable", ["draggableMap"]),
    zIndex() {
      return (
        this.draggableMap[this.uuid] && this.draggableMap[this.uuid].zIndex
      );
    },
  },
  async mounted() {
    this.uuid = await this["draggable/registerDraggable"]();
  },
  data: () => ({
    uuid: "",
    value: 50,
    isMouseDown: false,
    offset: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    options: {
      text: {
        color: "#FFFFFF",
        shadowEnable: true,
        shadowColor: "#000000",
        fontSize: 14,
        dynamicPosition: false,
        hideText: false,
      },
      progress: {
        color: "#2dbd2d",
        backgroundColor: "#333333",
        inverted: false,
      },
      layout: {
        height: 35,
        width: 140,
        verticalTextAlign: 61,
        horizontalTextAlign: 43,
        zeroOffset: 0,
        strokeWidth: 30,
        progressPadding: 0,
        type: "line",
      },
    },
  }),
  methods: {
    ...mapActions([
      "draggable/registerDraggable",
      "draggable/onDraggableSelected",
    ]),
    onStart({ x, y }) {
      this["draggable/onDraggableSelected"](this.uuid);
      this.isMouseDown = true;
      this.position = { x, y };
    },
  },
};
</script>
<style lang="scss">
.bubble {
  background: rgb(55, 55, 55);
  background: linear-gradient(
    0deg,
    rgba(55, 55, 55, 1) 0%,
    rgba(191, 191, 191, 1) 100%
  );
}
</style>
