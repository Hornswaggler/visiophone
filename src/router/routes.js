import ResponsiveLayout from '/src/components/layout/ResponsiveLayout.vue';
import UserSettings from '/src/components/pages/user/UserSettings.vue';
import UserLibrary from '/src/components/pages/user/UserLibrary.vue'
import SampleUpload from '/src/components/pages/sample/SampleUpload.vue';
import Search from '/src/components/pages/sample/SampleSearch.vue';
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
        component: Search
      },
      {
        path: SAMPLE_SEARCH,
        component: Search,
        meta: {
          headerHeight: '--sample-search-header-height'
        }
      },
      {
        path: SAMPLE_UPLOAD,
        component: SampleUpload,
        meta: {
          headerHeight: '--default-search-header-height'
        }
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
