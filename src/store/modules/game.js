import Vue from 'vue';
import {Map} from 'rot-js';
import PlayerModel from '@/model/game/PlayerModel.js';
import Entity from '@/model/game/SpikesModel.js';

const MARGIN = 11;

export default {
  namespaced: true,

  state: () => ({
    mapData: [],
    entities: [],
    height: 20,
    width: 20,
    tilesize: 40,
    map: {},
    resizing: false
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

    resizeMap({commit,state:{width}}, {clientHeight}){
      commit('setPrimitive', {
        key:'tilesize',
        value: Math.floor((clientHeight/width) - MARGIN)
      });
    },

    spawnEntity({commit}, {type}){
      const entity = new type();
      commit('addAll', {
        key: 'entities',
        values: [entity]
      });
      return entity;
    },

    async spawnPlayer({commit, dispatch}){
      const {x,y} = await dispatch('findFirstAvailable');
      const player = new PlayerModel({x,y});
      commit('addAll', {
        key: 'entities',
        values: [player]
      });
      return player;
    },

    async spawnSpikes({commit, dispatch}){
      const {x,y} = await dispatch('findRandomAvailable');
      const spikes = new Entity({x, y});
      commit('addAll', {
        key: 'entities',
        values: [spikes]
      });
      return spikes;
    },

    handleInputOn({state:{entities}, dispatch}, {key}) {
      entities.forEach(entity =>{
        entity.handleInput && entity.handleInput({dispatch},{key});
      });
    },

    stopEntity({commit, state:{entities}}, {key}){
      entities.forEach(entity =>{
        entity.handleOffput && entity.handleOffput({key});
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

    async findRandomAvailable({state:{mapData, height}, dispatch}) {
      const getRandom = () => ({
        x:Math.floor(Math.random() * height, mapData),
        y:Math.floor(Math.random() * height, mapData)
      });

      let {x:_x,y:_y} = getRandom();
      let found = !await dispatch('checkMapLocation',{x:_x, y:_y});
      while(!found){
        found = !await dispatch('checkMapLocation',{x:_x, y:_y});
        if(!found) {
          const {x,y} = getRandom();
          _x = x;
          _y = y;
        }
      }

      return {x:_x,y:_y};
    },

    checkMapLocation({state:{width, height, mapData, entities}}, {x, y}){
      try {
        const isWall = (x < 0 || y < 0)  || (x >= width || y >= height) ? true : mapData[x][y] === 0;
        const es = entities.some(({x:_x,y:_y}) => _x === x && _y === y);
        const isEntity = es|| false;
        return isWall || isEntity;
      } catch(e) {
        console.error(e);
        return true;
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
      values.forEach(value => {
        state[key].push(value);
      });
    },

    assignObject(state, {key, attr, value}){
      Vue.set(state[key],attr, value);
    }
  }

}
