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
  background: linear-gradient(120deg,rgb(0, 0, 0),rgb(3, 41, 53),rgb(0, 0, 0));


	background-size: 180% 180%;
	animation: gradient 18s ease infinite;
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
		background-position: 100% 100%;
	}
	100% {
		background-position: 0% 50%;
	}
}

</style>