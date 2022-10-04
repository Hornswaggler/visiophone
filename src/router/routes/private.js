import SamplePage from '@/components/pages/sample/SamplePage';
import UserPage from '@/components/pages/user/UserPage';
import UserSettings from '@/components/pages/user/UserSettings';
import UserLibrary from '@/components/pages/user/UserLibrary'
import SampleUpload from '@/components/pages/sample/SampleUpload';
import Search from '@/components/pages/sample/SampleSearch';
import {SAMPLE, SAMPLE_UPLOAD, SAMPLE_SEARCH, USER, USER_SETTINGS, USER_LIBRARY} from '@/router/routeNames';

const routes = [
  {
    path: `/${SAMPLE}`,
    component: SamplePage,
    children:[
      {
        path: SAMPLE_UPLOAD,
        component: SampleUpload
      },
      {
        path: SAMPLE_SEARCH,
        component:Search
      },
      {
        path:'',
        component:Search
      }

    ]
  },
  {
    path:`/${USER}`,
    component: UserPage,
    children:[
      {
        path: USER_SETTINGS,
        component: UserSettings
      },
      {
        path: USER_LIBRARY,
        component: UserLibrary
      }
    ]
  },
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});