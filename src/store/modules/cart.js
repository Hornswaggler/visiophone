export default {
  namespaced: true,
  state: () => ({
    showCartModal: false,
    items: [],
    cartModalOffsetX: 0,
    cartModalOffsetY: 0,
    defaultModalOffsetX: 0,
    defaultModalOffsetY: 0,
  }),
  actions:{
    setDefaultOffsets({commit}, {offsetX, offsetY}){
      commit('defaultModalOffsetX', offsetX);
      commit('defaultModalOffsetY', offsetY);
    },

    addSamplePackToCart({commit, dispatch, state:{items}}, samplePack) {
      if(!items.includes(samplePack)){
        commit('addSamplePackToCart', samplePack);
        dispatch('showCartModal');
      }
    },

    showCartModal({commit, state:{ defaultModalOffsetX, defaultModalOffsetY }}, {show = true, clickX = 0, clickY = 0} = { show: true, clickX: 0, clickY: 0 }) {
      const offsetX = clickX || defaultModalOffsetX;
      const offsetY = clickY || defaultModalOffsetY;

      commit('defaultModalOffsetX', offsetX);
      commit('defaultModalOffsetY', offsetY);
      commit('cartModalOffsetX', offsetX);
      commit('cartModalOffsetY', offsetY);
      commit('showCartModal', show);
    },

    toggleCartModal({dispatch, state:{showCartModal}}, {clickX = 0, clickY = 0} = {show: true, clickX: 0, clickY: 0}){
      dispatch('showCartModal', {clickX, clickY, show: !showCartModal});
    },
  },

  getters:{
    priceIds({items}){
      return items.map( ({priceId}) => priceId);
    }
  },
  mutations:{
    addSamplePackToCart(state, samplePack) {
      state.items.push(samplePack);
    },
    cartModalOffsetY(state, cartModalOffsetY){
      state.cartModalOffsetY = cartModalOffsetY;
    },
    cartModalOffsetX(state, cartModalOffsetX){
      state.cartModalOffsetX = cartModalOffsetX;
    },
    defaultModalOffsetY(state, defaultModalOffsetY){
      state.defaultModalOffsetY = defaultModalOffsetY;
    },

    defaultModalOffsetX(state, defaultModalOffsetX){
      state.defaultModalOffsetX = defaultModalOffsetX;
    },

    showCartModal(state, showCartModal) {
      state.showCartModal = showCartModal;
    },

  }
}