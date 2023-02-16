import router from '/src/router';
import config from '/src/config';
import {
  SAMPLE_UPLOAD,
  SAMPLE_SEARCH,
  USER_SETTINGS,
  USER_LIBRARY,
  SAMPLE_EXPLORE
} from '/src/router/routeNames';

const {STRIPE_ACCOUNT_STATUS:{NO_ACCOUNT, PENDING, APPROVED}} = config;

export default {
  namespaced: true,
  state: () => ({
    currentSlug: '',
    stripeAccountStatus: '',
    navigationItems: [
      {
        title: 'Explore',
        slug: `/${SAMPLE_EXPLORE}`,
        icon:'explore.svg',
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },
      {
        title: 'Samples',
        slug: `/${SAMPLE_SEARCH}`,
        icon:'samples.svg',
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },
      {
        title: 'Library',
        slug: `/${USER_LIBRARY}`,
        icon: 'library.svg',
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },
      {

        title: 'Upload',
        slug: `/${SAMPLE_UPLOAD}/pack`,
        icon:'upload.svg',
        accountStatus: [APPROVED]
      },
      {
        title: 'Settings',
        slug: `/${USER_SETTINGS}`,
        icon: 'settings.svg',
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },
    ],
  }),
  actions:{
    initialize({commit}, stripeAccountStatus) {
      commit('stripeAccountStatus', stripeAccountStatus);
      commit('currentSlug', router.currentRoute.path);
    },
    navigateToSlug({dispatch, state:{currentSlug}, getters:{navigationItemsForUser}}, slug) {
      if(currentSlug !== slug) {
        router.push(slug);
      }
    },
    setCurrentSlug({commit}, slug) {
      commit('currentSlug', slug);
    }
  },
  getters:{
    navigationItemsForUser({navigationItems, stripeAccountStatus}) {

      return navigationItems.filter(
        m =>  m.accountStatus.includes(stripeAccountStatus));
    }
  },
  mutations:{
    currentSlug(state, currentSlug) {
      state.currentSlug = currentSlug;
    },
    stripeAccountStatus(state, stripeAccountStatus){
      state.stripeAccountStatus = stripeAccountStatus;
    }
  }
}