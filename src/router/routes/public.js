import LandingPage from '@/components/layout/LandingPage.vue';
import {LANDING} from '@/router/routeNames';

const routes = [
  {
    path: `/${LANDING}`,
    name: `${LANDING}`,
    title: 'Visiophone',
    component: LandingPage
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