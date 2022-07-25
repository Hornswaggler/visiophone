import LandingPage from '@/components/layout/LandingPage.vue';

const routes = [
  {
    path: '/landingPage',
    name: 'landingPage',
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