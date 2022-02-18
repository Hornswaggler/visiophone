import Login from '@/views/Login.vue';
import GameCube from '@/views/GameCube.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    title:'Visiophone- Login',
    component: Login
  },
  {
    path: '/gamecube',
    name: 'gamecube',
    title:'???',
    component: GameCube
  },
];

export default routes.map(route => {
  const meta = {
    title: route.title,
    public: true,
    onlyLoggedOut: true
  }
  return { ...route, meta }
});