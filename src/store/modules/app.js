export default {
  namespaced: true,
  state: () => ({
    isLoading: false
  }),
  mutations:{
    isLoading(state, isLoading){
      state.isLoading = isLoading;
    }
  }
}