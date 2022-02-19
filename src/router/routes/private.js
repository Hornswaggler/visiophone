import Console from '@/components/console/Console.vue';
import Game from '@/components/game/Game.vue';


const routes = [
  {
    path: '/console',
    name: 'console',
    component: Console
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});