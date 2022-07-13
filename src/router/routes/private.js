import Game from '@/components/game/Game.vue';
import SampleSearch from '@/components/sampleSearch/SampleSearch.vue';

const routes = [
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '/sample-search',
    name: 'sampleSearch',
    component: SampleSearch
  }
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});