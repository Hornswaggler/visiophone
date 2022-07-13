import SampleSearch from '@/components/sampleSearch/SampleSearch.vue';

const routes = [
  {
    path: '/sample-search',
    name: 'sampleSearch',
    component: SampleSearch
  }
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});