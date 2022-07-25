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
          style="width:100%;"
        />
      </div>
      <!-- class="vp-input-body" -->
      <div style="width:100%;">
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
.vp-input-info {
  width:0;

}

.vp-input-contaier {
  display:flex;
  width:100%;
}

.vp-input-title {
  // flex:1;
  // display:flex;
  // align-items: center;
  // justify-content:flex-end;
  width:0;
}

.vp-input-body {
  flex:2;
  display:flex;
  flex-direction:column;
}
</style>