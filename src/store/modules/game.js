import Vue from 'vue';
import {Map} from 'rot-js';
import PlayerModel from '@/model/game/PlayerModel.js';
import SpikesModel from '@/model/game/SpikesModel.js';

const MARGIN = 0;

export default {
  namespaced: true,

  state: () => ({
    mapData: [],
    entities: [],
    height: 20,
    width: 30,
    tilesize: 40,
    map: {},
    resizing: false,
    tileset: []
  }),

  actions:{
    async initMap({commit, state:{width, height}}){
      const map = new Map.EllerMaze(width, height);

      const mapData = new Array(width);
      for (let x = 0; x < width; x++) {
        mapData[x] = new Array(height);
      }

      const result = await (() => new Promise((resolve, reject) => {
        const mapTile = {isBoundary:true, tile:{path: 'Rock_Block.png'}};
        const callback = (x, y, value) => {
          if(x === 0 || y === 0 || x === width -1 || y === height -1) {
            mapData[x][y] = {...mapTile, ...{tile:{ path: 'Floor_Tile.png'}}};
            return;
          }
          const isBoundary = value === 0 ? true : false;
          // const mapTile = {isBoundary}};

          mapData[x][y] = {...mapTile, ...{isBoundary,tile:{ path: !isBoundary ? 'Rock_Block.png' : 'Floor_Tile.png'}}};
        };

        map.create(callback);
        return resolve(mapData);
      }))();

      console.log('Adding map data...');

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

    getTileForMapPosition({mapData, x, y}){
      try{
        return mapData[x][y]
      }catch(e){
        console.error(e);
      }
      return -1;
    },

    async spawnEntity({commit, dispatch}, {entity}){      
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
      const {x, y} = await dispatch('findRandomAvailable');
      const spikes = new SpikesModel({x, y});
      commit('addAll', {
        key: 'entities',
        values: [spikes]
      });
      return spikes;
    },

    removeEntity({commit}, {id}){
      commit('removeEntity', {id});
    },

    handleInputOn({state:{entities}, dispatch}, {key}) {
      entities.forEach(entity => {
        entity.handleInput && entity.handleInput({dispatch, self: entity},{key});
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
          if(mapData[x][y].isBoundary){
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
      let found = await dispatch('checkMapLocation',{x:_x, y:_y});

      while(!found.clip){
        try{
          found = await dispatch('checkMapLocation',{x: _x, y: _y});

          if(!found.clip) {
            const {x,y} = getRandom();
            _x = x;
            _y = y;
          }
        }catch(e){
          console.error(e);
        }
      }

      return {x:_x,y:_y};
    },

    checkMapLocation({state:{width, height, mapData, entities}}, {x, y}) {
      let result = {
        clip: false,
      };

      try {
        const isWall = (x < 0 || y < 0)  || (x >= width || y >= height) ? true : !mapData[x][y].isBoundary;
        const entity = entities.find(
          ({x:_x,y:_y}) => _x === x && _y === y);

        result = {
          clip: !isWall,
          entity
        };

        return result;
      } catch(e) {
        console.error(e);
      } 

      return result;
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

    removeEntity(state, {id}){
      const removeIndex = state.entities.findIndex(({id:_id}) => _id === id);
      state.entities.splice(removeIndex, 1)
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
