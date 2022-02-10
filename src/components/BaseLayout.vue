<template>
<div class="container">
    <div class="container-content" style="height:100%;display:flex;flex-direction:column;">
      
      <!-- Header -->
      <div style="flex:0.25;height:100%;width:100%;padding-top:1em;">
        <div style="display:flex;flex-direction:column">
          <div style="flex:1;display:block;height:100%;width:100%;font-size: 0.75em;padding-bottom:0;">"GTS? That stands for Get That Shit" - @Paul Nation</div>
          <div style="flex:1;display:block;display:flex;justify-content: center">
            <img style="max-width:10em;" alt="Visiophone logo" src="../assets/Animated-Visio-Man.gif">
            <img style="max-width:25em;"  alt="Visiophone logo" src="../assets/crispy.png">
          </div>
          <div style="flex:1;display:block;padding:1em;">
            <div class="button" style="max-width:7em;display:inline-block;position:relative;">
              <img  style="height:100%;width:100%;"  src="../assets/Button.png"/>
              <div class="button-text" style="">
                Plugins
              </div>
            </div>

            <div class="button" style="max-width:7em;display:inline-block;position:relative;">
              <img  style="height:100%;width:100%;"  src="../assets/Button.png"/>
              <div class="button-text" style="">
                Samples
              </div>
            </div>

            <div class="button" style="max-width:7em;display:inline-block;position:relative;">
              <img  style="height:100%;width:100%;"  src="../assets/Button.png"/>
              <div class="button-text" style="">
                Videos
              </div>
            </div>


            <div class="button" style="max-width:7em;display:inline-block;position:relative;">
              <img  style="height:100%;width:100%;"  src="../assets/Button.png"/>
              <div class="button-text" style="">
                Services
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    <!-- Body -->
    <Carousel style="flex:0.5;background-color:black;display:flex;justify-content:space-evenly;align-items:center;position:relative; width:100%;"></Carousel>

    <!-- Footer -->
    <div style="flex: 0.25;height:100%;width:100%;display:flex;align-items:flex-end;justify-content:flex-end;padding-bottom:1em;">
      <div style="flex:1;"></div>
      <div style="flex:1;"></div>
      <div style="flex:1;display:flex;justify-content:flex-end;padding-right: 1em;">
        <img style="width:3em;display:inline-block;padding-left:1em;" src="../assets/Discord-Logo-Green.png"/>
        <img style="width:3em;display:inline-block;padding-left:1em;" src="../assets/Discord-Logo-Green.png"/>
        <img style="width:3em;display:inline-block;padding-left:1em;" src="../assets/Discord-Logo-Green.png"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Carousel from './Carousel.vue';

export default {
  name: 'BaseLayout',
  components:{
    Carousel
  },
  props: {
    msg: String
  },
  data: () => ({
    path: '../assets/Visioland.png'
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">



.container {
  position:absolute;
  top:0;left:0;bottom:0;right:0;
  display:flex;
  align-items: center;
  background-color:rgba(252, 252, 252, 0);

  &> *{
    flex:1;
  }

  .container-content{
    background-color:rgba(252, 252, 252, 0);
    display:flex;
    align-items: center;
  }
}

.image {
  flex:1;
  background-color:rgba(252, 252, 252, 0);
  transition: transform 0.24s linear 0s;
  &:hover{
    transform: scale(1.25, 1.25);
  }
}

.hover-zoom {
    cursor: pointer;
    transition: transform 0.24s linear 0s;

    &:hover{
      transform: scale(1.25, 1.25);
    }
}

.button {
  max-width:7em;
  display:inline-block;
  position:relative;

  cursor:pointer;
  transition: transform 0.24s linear 0s;

  .button-text{
    font-size: 0.75em;
    position:absolute;
    top:0;bottom:0;left:0;right:0;
    display:flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0.1em;
  }

  &:hover{
    transform: scale(1.25, 1.25);
  }
  
}

.card {
  min-width: 1em;
  min-height: 1em;
}

</style>
