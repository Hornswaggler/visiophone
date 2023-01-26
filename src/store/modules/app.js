import Vue from 'vue';
import scrollIntoView from 'scroll-into-view-if-needed'
import config from '/src/config';
import {DEFAULT_ROUTE} from '@/router/routeNames';
import {
  SAMPLE_UPLOAD,
  SAMPLE_SEARCH,
  USER_SETTINGS,
  USER_LIBRARY,
} from '/src/router/routeNames';

const {STRIPE_ACCOUNT_STATUS:{NO_ACCOUNT, PENDING, APPROVED}} = config;

const overlayOptionDefaults = () => ({
  showLoading: false,
  opacity: '0'
});

export default {
  namespaced: true,
  
  state: () => ({
    onSetCssProperty: () => {},
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
        slug: `/${SAMPLE_SEARCH}`,
        icon:'fa-house',
        id: 0,
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },
      {
        icon: 'fa-heart-music-camera-bolt',
        title: 'Library',
        slug: `/${USER_LIBRARY}`,
        id: 1,
        accountStatus: [NO_ACCOUNT, PENDING, APPROVED]
      },
      {

        title: 'Upload',
        slug: `/${SAMPLE_UPLOAD}`,
        icon:'fa-cloud-arrow-up',
        id: 2,
        accountStatus: [APPROVED]
      },
      {
        icon: 'fa-gear',
        title: 'Settings',
        slug: `/${USER_SETTINGS}`,
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
    onSetCssProperty({state:{onSetCssProperty}}, {key, value}){
      onSetCssProperty({key, value});
    },

    setOnSetCssProperty({commit}, onSetCssProperty) {
      commit('onSetCssProperty', onSetCssProperty);
    },

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
    },

    scrollToElement(context, element){
      scrollIntoView(element, {
        behavior: 'smooth', 
        scrollMode: 'if-needed'
      });
    },

    scrollToFirstError({dispatch}){
      const errors = [...document.getElementsByClassName('form-input-error')]
      .map(el=>({offsetTop: el.offsetTop, el}))
      .sort(({offsetTop:a}, {offsetTop:b}) => a - b)
      .map(({el}) => el);

      console.log('el', errors);

      if(errors.length > 0){
        dispatch('scrollToElement', errors[0]);
      }
    }
  },

  mutations: {
    onSetCssProperty(state, onSetCssProperty){
      Vue.set(state, 'onSetCssProperty', onSetCssProperty);
    },

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