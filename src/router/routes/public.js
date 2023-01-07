import { TERMS_OF_SERVICE, LANDING } from '../routeNames';
import LandingPage from '/src/components/layout/LandingPage.vue';
import TermsOfService from '/src/components/pages/publicPages/TermsOfService.vue'

const routes = [
  {
    path: `/${TERMS_OF_SERVICE}`,
    name: 'Terms of Service',
    title: 'VISIOPHONE ٩(̾●̮̮̃̾•̃̾)۶',
    component: TermsOfService
  },
  {
    path: `/${LANDING}`,
    name: `${LANDING}`,
    title: 'VISIOPHONE (╯°□°)╯︵ ┻━┻',
    component: LandingPage
  },
  {
    path: '/',
    name: `${LANDING}`,
    title: 'VISIOPHONE (╯°□°)╯︵ ┻━┻',
    component: LandingPage
  },
];

export default routes.map(route => {
  const meta = {
    title: route.title,
    isPublic: true,
    onlyLoggedOut: true
  }
  return { ...route, meta }
});