import SamplePage from '@/components/pages/sample/SamplePage';
import UserPage from '@/components/pages/user/UserPage';
import UserSettings from '@/components/pages/user/UserSettings';
import UserLibrary from '@/components/pages/user/UserLibrary'
import SampleUpload from '@/components/pages/sample/SampleUpload';
import Search from '@/components/pages/sample/SampleSearch';

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
    path:'/user',
    component: UserPage,
    children:[
      {
        path:'settings',
        component: UserSettings
      },
      {
        path:'library',
        component: UserLibrary
      }
    ]
  },
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});