import Game from '@/components/game/Game.vue';


const routes = [
  {
    path: '/game',
    name: 'game',
    component: Game
  },
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});