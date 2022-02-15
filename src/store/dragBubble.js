import { v4 as uuidv4 } from 'uuid';
import Vue from 'vue'

export default {
  namespaced: true,
  state: () => ({
    draggableMap: {}
  }),
  actions:{
    registerDraggable({commit}) {
      const uuid = uuidv4();
      
      commit('registerDraggable', uuid);
      return uuid;
    },
    onDraggableSelected({state, getters, commit }, uuid ){
      console.log('changed',state,uuid,state.draggableMap);
      console.log('REg', getters.maxZIndex);

      commit('draggableMap', {uuid, value:{top: true, zIndex: getters.maxZIndex}});

      Object
        .keys(state.draggableMap)
        .filter(key => key !== uuid)
        .map((uuid, i) => (commit('draggableMap', {uuid, value:{top: false, zIndex: i + 1 }}) ));

      return uuid;
    }
  },
  getters:{
    maxZIndex: state => Object.keys(state.draggableMap).length
  },
  mutations: {
    registerDraggable(state, id) {
      Vue.set(state.draggableMap, id, {top: false, zIndex: 0 });
      console.log('Registered');
    },
    draggableMap(state, {uuid, value}) {
      console.log('Updating Map');
      Vue.set(state.draggableMap, uuid, value);
    }
  }
};
