<template>
  <div
    style="width:100%;"
    class="HereIam"
  >
    <!-- <div style="width:100%;height:2em;background-color:rgb(56 56 56);"></div> -->
    <div style="width:100%;color:white;">
      <div style="display:flex;justify-content:space-around;font-size:1.5em;flex:1;">
        <div
          class="hover-zoom"
          style="color:#66FF00;width:100%;"
        >
          loops
        </div>
        <div
          class="hover-zoom"
          style="width:100%;"
        >
          one-shots
        </div>
        <div
          class="hover-zoom"
          style="width:100%;"
        >
          packs
        </div>
        <div
          class="hover-zoom"
          style="width:100%;"
        >
          random
        </div>
        <div
          class="hover-zoom"
          style="width:100%;"
          @click="onGame"
        >
          ???
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Navigation',
  methods:{
    onGame(){
      this.$router.push('/game')
    }
  }
}
</script>
