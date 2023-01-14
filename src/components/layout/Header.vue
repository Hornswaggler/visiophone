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
  'https://visiophone.wtf/avatars/Visioland_text.png',
  'https://visiophone.wtf/avatars/crispy.png',
  'https://visiophone.wtf/avatars/JedsSmoothInfluencercore.png',
  'https://visiophone.wtf/avatars/Psy.png',
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