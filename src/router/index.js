import Vue from "vue";
import Router from "vue-router";
import store from "../store";
import routes from "@/router/routes/index.js";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/console",
    },
  ].concat(routes),
});

router.beforeEach((to, from, next) => {
  const authenticated = store.state.user.authenticated;
  const onlyLoggedOut = to.matched.some((record) => record.meta.onlyLoggedOut);
  const isPublic = to.matched.some((record) => record.meta.public);

  if (!isPublic && !authenticated) {
    return next({
      path: "/gamecube",
      query: { redirect: to.fullPath },
    });
  }

  if (authenticated && onlyLoggedOut) {
    return next();
  }

  next();
});

const DEFAULT_TITLE = "Visiophone";
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
