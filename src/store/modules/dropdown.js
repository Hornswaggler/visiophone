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
      commit('setPrimitive',{key: 'clientX', value: clientX});
      commit('setPrimitive',{key: 'clientY', value: clientY});
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