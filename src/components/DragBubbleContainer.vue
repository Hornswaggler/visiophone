<template>
<div>
  <slot></slot>
</div>
</template>
<script>
export default {
  name: 'DragBubbleContainer',
  mounted(){
    console.log('Hello que tal?!');
    this.$on('asdf', ()=> {console.log('Fired!');})
  }
}
</script>