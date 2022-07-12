<template>
  <div
    class="scrollbar"
    style="flex:1;
      width:100%;
      display:flex;
      flex-direction: column;
      background-color:rgb(33, 35, 35);
      overflow-y:auto;"
  >
  <div
    style="
      display:flex;
      flex-direction: column;
      justify-content: flex-start;"
  >
    <slot name="scrolling-content"></slot>

  </div></div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.scrollbar
{


  flex:1;
  // width:100%;
  display:flex;
  flex-direction: column;
  background-color:rgb(33, 35, 35);
  overflow-y:auto;



	float: left;
	height: 300px;
	width: 65px;
	// background: #F5F5F5;
	// overflow-y: scroll;
	margin-bottom: 25px;

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