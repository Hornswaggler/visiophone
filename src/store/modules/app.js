import scrollIntoView from 'scroll-into-view-if-needed'
import {DEFAULT_ROUTE} from '@/router/routeNames';

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

      if(errors.length > 0){
        dispatch('scrollToElement', errors[0]);
      }
    }
  },

  mutations: {
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
    }
  }
}