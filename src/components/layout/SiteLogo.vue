<template>
  <div class="logo-container">
    <div class="animated-text">
      VISIOPHONE
    </div>
  </div>
</template>

<script>
export default {
  name:'SiteLogo'
}
</script>
<style lang="scss">
.logo-container {
  display:flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 3em;

  .animated-text {
    font-size: 1.4em;
    background: linear-gradient(180deg, #2cd8d5 0%, #9fafd3 50%, #5a2288 100%);
    animation: animated_text 10s ease infinite;
    background-size: 300%;

    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Inter;
    font-weight: 800;
    letter-spacing: 0.1em;

  }
}

@keyframes animated_text {
	0% { background-position: 0px 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0px 50%; }
}

</style>