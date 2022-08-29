<template>
<div class="bg-gradient"></div>
</template>

<script>
export default {
  name:'Background',
}
</script>

<style lang="scss">
.bg-gradient {
  background: linear-gradient(120deg,rgba(37, 37, 37, 0.889),rgba(0, 0, 0, 0.619),rgba(109, 109, 109, 0.75));
	background-size: 400% 400%;
	animation: gradient 60s ease infinite;
  z-index:-2;
  overflow:hidden;
  height:100vh;
  width: 100vw;
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

</style>