import ResponsiveLayout from '/src/components/layout/ResponsiveLayout.vue';
import UserSettings from '/src/components/pages/user/UserSettings.vue';
import UserLibrary from '/src/components/pages/user/UserLibrary.vue'
import SampleUpload from '/src/components/pages/sample/SampleUpload.vue';
import SamplePackUpload from '/src/components/pages/sample/SamplePackUpload.vue';
import SingleSampleUpload from '/src/components/pages/sample/SingleSampleUpload.vue';
import SamplePackSearch from '/src/components/pages/sample/SamplePackSearch.vue';
import UserStripeStandardReturn from '/src/components/pages/user/UserStripeStandardReturn.vue';
import SamplePurchaseReturn from '/src/components/pages/sample/SamplePurchaseReturn.vue';
import LandingPage from '/src/components/layout/LandingPage.vue';
import config from '/src/config.js';

const {VITE_APP_TITLE} = config;

import {
  SAMPLE_UPLOAD,
  SAMPLE_SEARCH,
  USER_SETTINGS,
  USER_LIBRARY,
  PROVISION_STRIPE_STANDARD_RETURN,
  PURCHASE_SAMPLE_RETURN,
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
        path: '',
        component: SamplePackSearch
      },
      {
        path: `/${SAMPLE_SEARCH}`,
        component: SamplePackSearch,
      },
      {
        path: SAMPLE_UPLOAD,
        name: SAMPLE_UPLOAD,
        component: SampleUpload,
        children:[
          {
            path: 'Single',
            name: 'Single',
            component: SingleSampleUpload
          },
          {
            path: 'Pack',
            name: 'Pack',
            component: SamplePackUpload
          }
        ]
      },
      {
        path: PURCHASE_SAMPLE_RETURN,
        component: SamplePurchaseReturn
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
        path: PROVISION_STRIPE_STANDARD_RETURN,
        component: UserStripeStandardReturn
      }
    ]
  }
];
