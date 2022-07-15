export default {
  namespaced:true,
  state: () => ({
    show: false,
    itemWidth: '0',
    clientX:'0',
    clientY: '0',
    onChanged: () => {},
    menuItems: () => ({})
  }),
  actions:{
    showDropdown({commit},{clientX, clientY, menuItems, itemWidth, onChanged}) {
      console.log('showing the dropdown');
      commit('setPrimitive',{key: 'clientX', value: clientX});
      commit('setPrimitive',{key: 'clientY', value: clientY});
      commit('setPrimitive',{key: 'menuItems', value: menuItems});
      commit('assignObject', {key: 'onChanged', value: onChanged});
      // commit('setPrimitive',{key: 'show', value: true});
      // commit('setPrimitive',{key: 'itemWidth', value: itemWidth});

    },
    hideDropdown({commit}){
      console.log('hiding dropdown');
      commit('setPrimitive',{key: 'show', value: false});
    }
  },
  mutations:{
    setItemWidth(state, itemWidth){
      console.log('setting item width;');
      state.show = true;
      state.itemWidth = itemWidth;
    }
  }
}