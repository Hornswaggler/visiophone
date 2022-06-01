import Vue from 'vue';
import {Map} from 'rot-js';
import {ENTITY_TYPE} from '../../model/game/EntityConfig.js';

const TILE_TYPE = {
  WALL:'WALL',
  FLOOR: 'FLOOR',
  DARK: 'DARK'
};

const TILESET = {
  [TILE_TYPE.WALL]:{
    isBoundary: true,
    path: 'Rock_Block.png'
  },
  [TILE_TYPE.FLOOR]: {
    isBoundary: false,
    path: 'Ground_Tile_Variation.png'
  },
  [TILE_TYPE.DARK]:{
    isBoundary: false,
    path: 'Dark_Block.png'
  }
};

export default {
  namespaced: true,

  state: () => ({
    mapData: [],
    entities: [],
    height: 1000,
    width: 1000,
    tilesize: 1,
    map: {},
    resizing: false,
    imageCache: {},
    clientHeight: 100,
    clientWidth: 100,
    offSetX: 0,
    offSetY: 0,
    scaleFactor: 75
  }),

  actions:{
    async initMap({commit, state:{width, height}}) {
      const map = new Map.EllerMaze(width, height);

      let cache = {};
      let key = Object.keys(TILE_TYPE)[0];
      for(let i = 0; i < Object.keys(TILE_TYPE).length; i ++, key = Object.keys(TILE_TYPE)[i]) {
        const sprite = new Image();
        sprite.src = require(`@/assets/${TILESET[key].path}`);

        await (() => 
          new Promise((resolve) => 
            sprite.addEventListener("load", () => resolve('loaded'))))();

        cache[key] = {...TILESET[key], sprite: sprite}
      }

      const mapData = new Array(width);
      for (let x = 0; x < width; x++) {
        mapData[x] = new Array(height);
      }

      const result = await (() => new Promise((resolve) => {
        const callback = (x, y, value) => {
          mapData[x][y] = value ? cache[TILE_TYPE.FLOOR] : cache[TILE_TYPE.WALL];
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

    resizeMap({commit,state:{width, height, scaleFactor}}, {clientHeight, clientWidth}) {
      commit('setPrimitive', {
        key: 'clientHeight',
        value: clientHeight
      });

      commit('setPrimitive', {
        key: 'clientWidth',
        value: clientWidth
      });
    },

    getTileForMapPosition({mapData, x, y}){
      try{
        return mapData[x][y];
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

    removeEntity({commit}, {id}){
      commit('removeEntity', {id});
    },

    async handleInputOn({state:{ entities }, dispatch, commit}, {key}) {
      const activatedEntities = [];
      for(let i = 0; i < entities.length; i++){
        const entity = entities[i];
        if(!entity.handleInput) continue;
        activatedEntities.push({...await entity.handleInput({dispatch, self: entity, commit}, {key}), entity: entity });
      }

      if(activatedEntities.length > 0) dispatch('activateEntities');
      return activatedEntities;
    },

    activateEntities({dispatch, state:{entities, mapData}}){
      const target = entities.find(({type}) => {
        return type === ENTITY_TYPE.PLAYER;
      });

      entities
        .filter(e => e.activate)
        .map(e => e.activate({dispatch, mapData, self: e, target}))
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
          if(!mapData[x][y].isBoundary){
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
        const isWall = mapData[x] && mapData[x][y] != undefined ? mapData[x][y].isBoundary : true;
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
    },

    updateOffsetX({commit}, offSetX) {
      commit('setPrimitive', {
        key: 'offSetX',
        value: offSetX
      });
      return offSetX;
    },

    updateOffsetY({commit}, offSetY) {
      console.log('Updating offsetY: ', offSetY);
      commit('setPrimitive', {
        key: 'offSetY',
        value: offSetY
      });
      return offSetY;
    },
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
