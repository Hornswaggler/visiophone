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
    closeOverlayOnclick: true,
    opacity: '0',
    targetUrl:''
  }),

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