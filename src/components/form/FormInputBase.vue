<template>
  <div class="vp-input">
    <!-- TODO do we need this? -->
    <!-- <div class="vp-input-info">
      <span>
        <slot name="info" />
      </span>
    </div> -->
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
  position:relative;
}

.vp-input-title-container {
  position:absolute;
  top:0;
  left:0;
  display:flex; 
  justify-content: flex-start;
  align-content: flex-start;


  .vp-input-title {
    margin-top: -0.75em;
    margin-left: 1em;
    color:white;
  }
}

.vp-input-body {
  flex:2;
  display: flex;
  flex-direction:column;
}
</style>