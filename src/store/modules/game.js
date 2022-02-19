import Vue from 'vue';
import {Map} from 'rot-js';
import Player from '@/model/game/Player.js';

const MARGIN = 5;

export const ENTITY_TYPE = {
  PLAYER:'PLAYER'
};

export default {
  namespaced: true,
  state: () => ({
    mapData: [],
    entities: [],
    height: 20,
    width: 20,
    tilesize: 40,
    map: {}
  }),
  actions:{
    async initMap({commit, state:{width, height}}){
      const map = new Map.EllerMaze(width, height);

      const mapData = new Array(width);
      for (let x = 0; x < width; x++) {
        mapData[x] = new Array(height);
      }

      const result = await (() => new Promise((resolve, reject) => {
        const callback = (x, y, value) => {
          if(x === 0 || y === 0 || x === width -1 || y === height -1) {
            mapData[x][y] = 1;
            return;
          }
          mapData[x][y] = value === 0 ? 1 : 0;
        };
  
        map.create(callback);
        return resolve(mapData);
      }))();
      
      commit('addAll', {
        key: 'mapData',
        values: mapData
      });

      return result;
    },

    resizeMap({commit,state:{tilesize}}, {clientHeight}){
      commit('setPrimitive',{
        key:'tileSize',
        value: Math.floor((clientHeight/tilesize) - MARGIN)
      });
    },

    async spawnPlayer({commit, dispatch}){
      const player = [new Player()];
      commit('addAll', {
        key: 'entities',
        values: player
      });
      return player;
    },

    handleInput({state:{entities}, dispatch}, {key}) {
      entities.forEach(entity =>{
        entity.handleInput({dispatch},{key});
      });
    },

    findFirstAvailable({state:{mapData}}) {
      let coords;
      for(let x = 0; x < mapData.length; x++){
        for(let y = 0; y < mapData[x].length; y++){
          if(mapData[x][y] === 1){
            coords = {x,y};
            break;
          }
        }
        if(coords) break;
      }
      return coords;
    },

    checkMapLocation({state:{width, height, mapData}}, {x, y}){
      try {
        return (x < 0 || y < 0)  || (x > width || y > height) ? 0 : mapData[x][y];
      } catch(e) {
        return 0;
      }
    }
  },
  getters:{
    getEntityById: (state) => (id) => {
      return state.entities.find(({id:_id}) => _id === id);
    }
  },
  mutations:{
    setPrimitive(state, {key, value}){
      state[key] = value;
    },
    addAll(state, {key, values}){
      console.log('Adding all');
      values.forEach(value => {
        console.log('ADDING:', value);
        state[key].push(value);
      });
    },
    assignObject(state, {key, value}){
      Vue.set(state[key], value);
    }
  }
}