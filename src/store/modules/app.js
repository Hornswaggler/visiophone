import config from '@/config';
import {DEFAULT_ROUTE} from '@/router/routeNames';

const {STRIPE_ACCOUNT_STATUS:{NO_ACCOUNT, PENDING, APPROVED}} = config;

const overlayOptionDefaults = () => ({
  showLoading: false,
  opacity: '0'
});

export default {
  namespaced: true,
  
  state: () => ({
    isLoading: false,
    loading: false,
    showOverlay: false,
    isMobile: !!window.navigator.userAgent.match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/),
    closeOverlayOnclick: true,
    opacity: '0',
    targetUrl:`/${DEFAULT_ROUTE}`,
    sideNavigationIndex: 0,
    sideNavigationMenuItems: [
      {
        title: 'Browse',
        slug:'/sample',
        icon:'fa-house',
        id: 0,
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },
      {
        icon: 'fa-heart-music-camera-bolt',
        title: 'Library',
        slug: '/user/library',
        id: 1,
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },
      {

        title: 'Upload',
        slug:'/sample/upload',
        icon:'fa-cloud-arrow-up',
        id: 2,
        accountStatus: [APPROVED]
      },
      {
        icon: 'fa-gear',
        title: 'Settings',
        slug: '/user/settings',
        id: 3,
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },

    ],
    showMenu: false
  }),

  getters:{
    sideNavigationMenuItemById({sideNavigationMenuItems}){
      return sideNavigationMenuItems.reduce((acc, item) => {
        acc[`${item.id}`] = item;
        return acc;
      },{});
    }
  },

  actions: {
    showOverlay({commit}, {showLoading, opacity} = overlayOptionDefaults()) {
      commit('setLoading', showLoading);
      commit('setOpacity', opacity);
      commit('setShowOverlay', true);
    },

    hideOverlay({commit}) {
      commit('setLoading', false);
      commit('setOpacity', false);
      commit('setShowOverlay', false);
    },

    setSideNavigationMenuItems({commit}, sideNavigationMenuItems) {
      commit('assignObject', {key: 'sideNavigationMenuItems', value: sideNavigationMenuItems});
    }
  },

  mutations: {
    setShowMenu(state, showMenu) {
      state.showMenu = showMenu;
    },
  
    isLoading(state, loading) {
      state.loading = loading;
    },
  
    setLoading(state, loading) {
      state.loading = loading;
    },
  
    setOpacity(state, opacity) {
      state.opacity = opacity;
    },
  
    setShowOverlay(state, showOverlay) {
      state.showOverlay = showOverlay;
    },
  
    setTargetUrl(state, targetUrl) {
      state.targetUrl = targetUrl;
    },
  
    setSideNavigationIndex(state, sideNavigationIndex) {
      state.sideNavigationIndex = sideNavigationIndex;
    }
  
  }
}