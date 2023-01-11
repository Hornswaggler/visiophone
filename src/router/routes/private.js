import DefaultPageLayout from '/src/components/layout/DefaultPageLayout.vue';
import UserSettings from '/src/components/pages/user/UserSettings.vue';
import UserLibrary from '/src/components/pages/user/UserLibrary.vue'
import SampleUpload from '/src/components/pages/sample/SampleUpload.vue';
import Search from '/src/components/pages/sample/SampleSearch.vue';
import UserStripeStandardReturn from '/src/components/pages/user/UserStripeStandardReturn.vue';
import SamplePurchaseReturn from '/src/components/pages/sample/SamplePurchaseReturn.vue';

import {
  SAMPLE_UPLOAD,
  SAMPLE_SEARCH,
  USER_SETTINGS,
  USER_LIBRARY,
  PROVISION_STRIPE_STANDARD_RETURN,
  PURCHASE_SAMPLE_RETURN
} from '/src/router/routeNames';

const routes = [
  {
    path:'/',
    component: DefaultPageLayout,
    children:[
      {
        path: '',
        component: Search
      },
      {
        path: SAMPLE_SEARCH,
        component: Search
      },
      {
        path: SAMPLE_UPLOAD,
        component: SampleUpload
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

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});