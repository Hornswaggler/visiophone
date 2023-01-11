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
  'https://visiophone.wtf/Visioland_text.png',
  'https://visiophone.wtf/crispy.png',
  'https://visiophone.wtf/JedsSmoothInfluencercore.png',
  'https://visiophone.wtf/Psy.png',
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