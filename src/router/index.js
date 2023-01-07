import Vue from 'vue'
import Router from 'vue-router'
import store from  '../store'
import routes from '/src/router/routes/index.js'

Vue.use(Router);

const router = new Router({
  routes
});

router.beforeEach((to, from, next) => {
  const authenticated = store.state.user.authenticated;
  const onlyLoggedOut = to.matched.some(record => record.meta.onlyLoggedOut);
  const isPublic = to.matched.some(record => record.meta.isPublic);

  console.log('to::: ', to)
  console.log('isPublic::: ', isPublic)
  console.log('store::: ', store.state.user.authenticated)


  // if (!isPublic && !authenticated) {
  //   store.commit('app/setTargetUrl', to.path)
  //   return next({
  //     path: '/landingPage',
  //     query: { redirect: to.fullPath }
  //   });
  // }


  

  next();
});

const DEFAULT_TITLE = "VISIOPHONE (╯°□°)╯︵ ┻━┻";
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
      document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;