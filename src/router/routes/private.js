import SamplePage from '/src/components/pages/sample/SamplePage.vue';
import UserPage from '/src/components/pages/user/UserPage.vue';
import UserSettings from '/src/components/pages/user/UserSettings.vue';
import UserLibrary from '/src/components/pages/user/UserLibrary.vue'
import SampleUpload from '/src/components/pages/sample/SampleUpload.vue';
import Search from '/src/components/pages/sample/SampleSearch.vue';
import UserStripeStandardReturn from '/src/components/pages/user/UserStripeStandardReturn.vue';
import SamplePurchaseReturn from '/src/components/pages/sample/SamplePurchaseReturn.vue';
import {
  SAMPLE,
  SAMPLE_UPLOAD,
  SAMPLE_SEARCH,
  USER,
  USER_SETTINGS,
  USER_LIBRARY,
  PROVISION_STRIPE_STANDARD_RETURN,
  PURCHASE_SAMPLE_RETURN
} from '/src/router/routeNames';

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
      },
      {
        path: PURCHASE_SAMPLE_RETURN,
        component: SamplePurchaseReturn
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
      },
      {
        path: PROVISION_STRIPE_STANDARD_RETURN,
        component: UserStripeStandardReturn
      }
    ]
  },
];

export default routes.map(route => {
  return { ...route, meta: { public: false } }
});