const overlayOptionDefaults = () => ({
  showLoading: false,
  opacity: '0'
});

export default {
  namespaced: true,
  // TODO: Needs some refactoring still
  state: () => ({
    isLoading: false,
    loading: false,
    showOverlay: false,
    closeOverlayOnclick: true,
    opacity: '0',
  }),
  actions:{
    showOverlay({commit}, {showLoading, opacity} = overlayOptionDefaults()){
      commit('setLoading', showLoading);
      commit('setOpacity', opacity);
      commit('setShowOverlay', true);
    },
    hideOverlay({commit}){
      commit('setLoading', false);
      commit('setOpacity', false);
      commit('setShowOverlay', false);
    }
  },
  mutations:{
    isLoading(state, isLoading){
      state.isLoading = isLoading;
    },
    setLoading(state, loading){
      state.loading = loading;
    },
    setOpacity(state, opacity){
      state.opacity = opacity;
    },
    setShowOverlay(state, showOverlay){
      state.showOverlay = showOverlay;
    }
    
  }
}