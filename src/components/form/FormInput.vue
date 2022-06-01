<template>
<div class="vp-input">
  <div class="vp-input-info">
    <div class="flex-1">&nbsp;</div>
    <div class="flex-2">
      <slot name="info"></slot>
    </div>
  </div>
  <div class="vp-input-contaier">
    <div class="vp-input-title">
      <slot name="title"></slot>
    </div>
    <div class="vp-input-body">
      <slot name="input"></slot>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'FormInput'
}
</script>

<style lang="scss">
.vp-input-info {
  width:100%;
  display:flex;
}

.vp-input-contaier {
  display:flex;
  width:100%;
}

.vp-input-title {
  flex:1;
  display:flex;
  padding-right: 1em;
  align-items: center;
  justify-content:flex-end;
  width:100%;
}

.vp-input-body {
  flex:2;
  display:flex;
  flex-direction:column;
}
</style>