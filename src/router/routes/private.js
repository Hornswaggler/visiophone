import Console from '@/views/Console.vue';

const routes = [
  {
    path: '/console',
    name: 'console',
    component: Console
  },
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});