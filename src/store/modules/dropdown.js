export default {
  namespaced:true,
  state: () => ({
    show: false,
    itemWidth: '0',
    clientX:'0',
    clientY: '0',
    onChanged: () => {},
    menuItems: {}
  }),

  actions:{
    showDropdown({commit},{clientX, clientY, menuItems, itemWidth, onChanged}) {
      //TODO: Fix this kludge... later...
      const {clientWidth} = document.body;

      let xpos = clientX;
      if((clientX + 200) > clientWidth){
        xpos = clientX - 200;
      }

      commit('setPrimitive',{key: 'clientX', value: `${xpos}px`});
      commit('setPrimitive',{key: 'clientY', value: `${clientY}px`});
      commit('assignObject',{key: 'menuItems', value: menuItems});
      commit('assignObject', {key: 'onChanged', value: onChanged});
      commit('setPrimitive',{key: 'itemWidth', value: itemWidth});
    },

    hideDropdown({commit}) {
      commit('setPrimitive',{key: 'show', value: false});
    }
  },
  mutations: {
    setItemWidth(state, itemWidth){
      state.show = true;
      state.itemWidth = itemWidth;
    }
  }
}