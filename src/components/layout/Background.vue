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
	background: linear-gradient(120deg, rgb(195, 140, 223), rgb(3, 53, 15), rgb(0, 255, 30));
	background-size: 180% 180%;
	animation: gradient-animation 18s ease infinite;
  z-index:-2;
  overflow:hidden;
  height:100vh;
  width: 100vw;
	opacity:0.5;
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 100%;
	}
	100% {
		background-position: 0% 50%;
	}
}

</style>