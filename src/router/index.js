import Vue from 'vue'
import Router from 'vue-router'
import store from  '../store'
import config from '/src/config.js';
import { AUTH } from '/src/router/routeNames';
import { DEFAULT_ROUTE } from '/src/router/routeNames';

import routes from '/src/router/routes.js';

Vue.use(Router);

const router = new Router({
  routes
});

router.beforeEach((to, from, next) => {
  const authenticated = store.state.user.authenticated;
  const isPublic = to.matched.some(record => record.meta.public);

  if (!isPublic && !authenticated) {
    store.commit('app/setTargetUrl', to.path);

    return router.push({
      path: `/${AUTH}`,
      query: { redirect: to.fullPath }
    });
  }

  const headerHeight = to.meta.headerHeight || '--default-search-header-height';
  store.dispatch('app/onSetCssProperty', {key: '--search-header-height', value: `var(${headerHeight})`});

  if(to.path === '/') {
    return router.push({
      ...to,
      path: DEFAULT_ROUTE
    });
    ;
  }

  next();
});

const {VITE_APP_TITLE} = config;
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
      document.title = to.meta.title || VITE_APP_TITLE;
  });
});

export default router;