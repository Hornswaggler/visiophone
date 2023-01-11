import LandingPage from '/src/components/layout/LandingPage.vue';
import {LANDING} from '/src/router/routeNames';

const routes = [
  {
    path: `/${LANDING}`,
    name: `${LANDING}`,
    title: 'VISIOPHONE (╯°□°)╯︵ ┻━┻',
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