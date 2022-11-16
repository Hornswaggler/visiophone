import LandingPage from '/src/components/layout/LandingPage.vue';
import {LANDING, PROVISION_STRIPE_STANDARD_REFRESH} from '/src/router/routeNames';

const routes = [
  {
    path: `/${LANDING}`,
    name: `${LANDING}`,
    title: 'VISIOPHONE (╯°□°)╯︵ ┻━┻',
    component: LandingPage
  },
  {
    path: `/${PROVISION_STRIPE_STANDARD_REFRESH}`,
    name: `/${PROVISION_STRIPE_STANDARD_REFRESH}`,
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