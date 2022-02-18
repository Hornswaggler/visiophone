import Console from '@/views/Console.vue';
import Game from '@/views/Game.vue';


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