// import SampleSearch from '@/components/sampleSearch/SampleSearch.vue';
import SamplePage from '@/components/pages/sample/SamplePage.vue';
import Console from '@/components/console/Console.vue';
import SampleUpload from '@/components/pages/sample/SampleUpload.vue';
import Search from '@/components/pages/sample/SampleSearch.vue';

const routes = [
  {
    path: '/sample',
    component: SamplePage,
    children:[
      {
        path:'upload',
        component:SampleUpload
      },
      {
        path:'search',
        component:Search
      },
      {
        path:'',
        component:Search
      }

    ]
  },
  {
    path: '/console',
    name: 'console',
    component: Console
  },
  // {
  //   path: '/upload',
  //   name: 'upload',
  //   component: Upload
  // }
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});