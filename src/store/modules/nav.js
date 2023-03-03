import router from '/src/router';
import config from '/src/config';
import {
  SAMPLE_UPLOAD,
  SAMPLE_PACK_TABLE_SEARCH,
  USER_SETTINGS,
  USER_LIBRARY,
  SAMPLE_PACK_TABLE_EXPLORE,
  SAMPLE_PACK_DETAILS
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
        slug: `/${SAMPLE_PACK_TABLE_EXPLORE}`,
        children: [
          {
            title: 'Details',
            slug: `${SAMPLE_PACK_DETAILS}`
          }
        ],
        icon:'explore.svg',
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED],
      },
      {
        title: 'Samples',
        slug: `/${SAMPLE_PACK_TABLE_SEARCH}`,
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
    ].map(item => ({children: [], ...item}))
  }),
  actions:{
    initialize({commit}, stripeAccountStatus) {
      commit('stripeAccountStatus', stripeAccountStatus);
      commit('currentSlug', router.currentRoute.path);
    },

    navigateToSlug({state:{currentSlug}}, slug) {
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
    },
    breadcrumbs({navigationItems, currentSlug}){
      return navigationItems.reduce((acc,{title, slug, children}, i) => {
        const child = children.find(child => currentSlug.includes(child.slug));
        if(slug === currentSlug) {
          acc.push(title);
        } else if(child != null) {
          acc.push({title, slug});
          acc.push({title: child.title, slug: child.slug});
        }
        return acc;
      }, []).map(({title, slug}, id) => ({id, title, slug}));
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