<template>
  <div class="vp-input">
    <div
      class="vp-input-container"
    >
      <div class="vp-input-title-container">
        <div class="vp-input-title">
          <slot
            name="title"
          />
        </div>
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

.vp-input-container {
  display: flex;
  position:relative;
  width:100%;
  height: 100%;
}

.vp-input-title-container {
  position:absolute;
  top:0;
  left:0;
  display:flex; 
  justify-content: flex-start;
  align-content: flex-start;


  .vp-input-title {
    margin-top: -0.85em;
    margin-left: 1em;
    color:white;
    font-size: 0.8em;
  }
}

.vp-input-body {
  font-size: var(--vp-form-text-size);
  background-color: var(--vp-input-background-color);
  flex:2;
  display: flex;
  flex-direction:column;
  min-height: var(--vp-input-min-height);
}
</style>