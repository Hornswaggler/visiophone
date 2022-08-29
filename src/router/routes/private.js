import SamplePage from '@/components/pages/sample/SamplePage.vue';
import UserSettingsPage from '@/components/pages/user-settings/UserSettingsPage';
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
    path:'/user-settings',
    component: UserSettingsPage
  }
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});