export default {
  namespaced: true,
  state: () => ({
    items: []
  }),
  actions:{
    addSamplePackToCart({commit, state:{items}}, samplePack) {
      for(var i = 0; i < samplePack.samples.length; i++) {
        if(!items.includes(samplePack.samples[i])) {
          commit('addSamplePackToCart', samplePack.samples[i])
        }
      }
    }
  }, 
  getters:{
    priceIds({items}){
      return items.map( ({priceId}) => priceId);
    }
  },
  mutations:{
    addSamplePackToCart(state, sample) {
      state.items.push(sample);
    }
  }
}