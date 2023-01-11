<template>
  <carousel
    :elements="headerElements"
  >
    <div class="fill flex justify-end"></div>
  </carousel>
</template>

<script>
import Carousel from '@/components/form/Carousel.vue';

const headerElements = [
  'https://visiophone.wtf/assets/Visioland_text.png',
  'https://visiophone.wtf/assets/crispy.png',
  'https://visiophone.wtf/assets/JedsSmoothInfluencercore.png',
  'https://visiophone.wtf/assets/Psy.png',
];

export default {
  name:'Header',
  components:{
    Carousel
  },

  data:() => ({
    headerElements,
  }),
}
</script>