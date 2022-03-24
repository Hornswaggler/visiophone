import Vue from 'vue';
import {Map} from 'rot-js';

const MARGIN = 18;

const TILE_TYPE = {
  WALL:'WALL',
  FLOOR: 'FLOOR'
}

const TILESET = {
  [TILE_TYPE.WALL]:{
    isBoundary: true,
    path: 'Grass_Block.png'
  },
  [TILE_TYPE.FLOOR]: {
    isBoundary: false,
    path: 'Floor_Tile.png'
  }
}

export default {
  namespaced: true,

  state: () => ({
    mapData: [],
    entities: [],
    height: 20,
    width: 30,
    tilesize: 20,
    map: {},
    resizing: false,
    imageCache: {}
  }),

  actions:{
    async initMap({commit, state:{width, height}}){
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

      const result = await (() => new Promise((resolve, reject) => {
        const callback = (x, y, value) => {
          const isBoundary = (x === 0 || y === 0 || x === width -1 || y === height -1) || value === 0;
          mapData[x][y] = isBoundary ? cache[TILE_TYPE.FLOOR] : cache[TILE_TYPE.WALL];
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

    resizeMap({commit,state:{width, height}}, {clientHeight, clientWidth}) {
      console.log('Resizign Maps');
      const dy = Math.floor((clientHeight/height) - MARGIN);
      const dx = Math.floor((clientWidth/width) - MARGIN);



      const tilesize = dy > dx ? dy: dx;

      commit('setPrimitive', {
        key:'tilesize',
        value: tilesize
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
      console.log('looking', mapData.map(d => TILE_TYPE));
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
        const isWall = (x < 0 || y < 0)  || (x >= width || y >= height) ? true : mapData[x][y].isBoundary;
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
