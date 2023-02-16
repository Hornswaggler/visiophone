import ResponsiveLayout from '/src/components/layout/ResponsiveLayout.vue';
import UserSettings from '/src/components/pages/user/UserSettings.vue';
import UserLibrary from '/src/components/pages/user/UserLibrary.vue'
import SampleUpload from '/src/components/pages/sample/SampleUpload.vue';
import SamplePackUpload from '/src/components/pages/sample/SamplePackUpload.vue';
import SingleSampleUpload from '/src/components/pages/sample/SingleSampleUpload.vue';
import SamplePackSearch from '/src/components/pages/sample/SamplePackSearch.vue';
import LandingPage from '/src/components/layout/LandingPage.vue';
import config from '/src/config.js';

const {VITE_APP_TITLE,} = config;

import {
  SAMPLE,
  SAMPLE_UPLOAD,
  SAMPLE_MODE_PARAM,
  SAMPLE_EXPLORE,
  USER_SETTINGS,
  USER_LIBRARY,
  AUTH
} from '/src/router/routeNames';

export default [
  {
    path:'/',
    component: ResponsiveLayout,
    children:[
      {
        path: `/${AUTH}`,
        name: `${AUTH}`,
        title: VITE_APP_TITLE,
        component: LandingPage,
        meta: {
          title: VITE_APP_TITLE,
          public: true,
        }
      },
      {
        path: `/${SAMPLE}/${SAMPLE_MODE_PARAM}`,
        component: SamplePackSearch,
      },
      {
        path: '',
        redirect: `/${SAMPLE_EXPLORE}`
      },
      {
        path: SAMPLE_UPLOAD,
        name: SAMPLE_UPLOAD,
        component: SampleUpload,
        children:[
          {
            path: 'Single',
            name: 'Single',
            component: SingleSampleUpload,
            meta: {
              isSellerRoute: true
            },
          },
          {
            path: 'Pack',
            name: 'Pack',
            component: SamplePackUpload,
            meta: {
              isSellerRoute: true
            },
          }
        ]
      },
      {
        path: USER_LIBRARY,
        component: UserLibrary
      },
      {
        path: USER_SETTINGS,
        component: UserSettings
      },
      {
        path :'*',
        redirect: `/${SAMPLE_EXPLORE}`
      }
    ]
  }
];
