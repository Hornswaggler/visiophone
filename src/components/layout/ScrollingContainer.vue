<template>
  <div class="scrollbar">
    <div class="flex flex-column justify-start p1">
      <slot name="scrolling-content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrollingContainer'
}
</script>

<style lang="scss">

.scrollbar
{
  flex:1;
  width:100%;
  display:flex;
  flex-direction: column;
  background-color: rgba(33, 35, 35, 0.9);
  overflow-y:auto;

  &::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: rgb(17, 17, 17);
  }

  &::-webkit-scrollbar
  {
    width: 12px;
    background-color: black;
  }

  &::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }
}
</style>