<template>
  <div
    class="scrollbar fill"
  >
    <div
      class="scrolling-container flex flex-column"
    >
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
.scrolling-container {
  padding: 1em;
  justify-content: flex-start;
}

.scrollbar
{
  max-height:calc(100vh - 5em);
  border-radius:6px;
  flex:1;
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