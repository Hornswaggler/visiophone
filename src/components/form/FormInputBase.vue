<template>
  <div class="vp-input">
    <div class="vp-input-info">
      <span>
        <slot name="info" />
      </span>
    </div>
    <div class="vp-input-contaier">
      <div class="vp-input-title">
        <slot
          name="title"
        />
      </div>
      
      <div class="vp-input-body">
        <slot name="input" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormInputBase'
}
</script>

<style lang="scss">

.vp-input-contaier {
  display:flex;
}

.vp-input-title {
  display:flex;
  align-items: center;
  justify-content:flex-start;
}

.vp-input-body {
  flex:2;
  display:flex;
  flex-direction:column;
}
</style>