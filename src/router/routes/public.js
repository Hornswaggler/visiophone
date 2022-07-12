import GameCube from '@/components/game/GameCube.vue';
import Console from '@/components/console/Console.vue';
import Upload from '@/components/upload/Upload.vue';
import LandingPage from '@/components/layout/LandingPage.vue';

const routes = [
  {
    path: '/landingPage',
    name: 'landingPage',
    title: 'Visiophone',
    component: LandingPage
  },
  {
    path: '/gamecube',
    name: 'gamecube',
    title:'???',
    component: GameCube
  },
  {
    path: '/console',
    name: 'console',
    component: Console
  },
  {
    path: '/upload',
    name: 'upload',
    component: Upload
  }
];

export default routes.map(route => {
  const meta = {
    title: route.title,
    public: true,
    onlyLoggedOut: true
  }
  return { ...route, meta }
});