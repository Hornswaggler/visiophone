import SampleSearch from '@/components/sampleSearch/SampleSearch.vue';
import Console from '@/components/console/Console.vue';
import Upload from '@/components/upload/Upload.vue';
import Game from '@/components/game/Game.vue';

const routes = [
  {
    path: '/sample-search',
    name: 'sampleSearch',
    component: SampleSearch,
    children:[
      {
        path:'upload',
        component:Upload
      }
      
    ]
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
  return { ...route, meta: { public: false } }
});