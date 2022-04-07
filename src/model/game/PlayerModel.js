import { makeEntity } from './Entity';
import { ENTITY_TYPE } from './EntityConfig';
import { STATE_MAP, STATE } from './PlayerConfig';
import store from '../../store/';

const handlers = 
  Object.keys(STATE_MAP)
    .reduce((acc, key) => {
      acc[STATE_MAP[key].key] = STATE_MAP[key].handler;
      return acc;
    },
  {});

const frames = 
  Object.keys(STATE_MAP)
    .reduce((acc, key) => {
      acc[STATE_MAP[key].key] = STATE_MAP[key].path;
      return acc;
    },
  {});

export default ({x,y}) => {
  try{
    return new (({x,y}) => ({
      ...makeEntity({x,y, type: ENTITY_TYPE.PLAYER, zIndex: 3}),
      async handleInput({dispatch, self},{key}) {
        const {x, y, handlers} = self;
        if(handlers[key] == undefined) return false;

        try{
          const template = { dx: 0, dy: 0 };
          const delta = handlers[key] ? { ...template, ...handlers[key]() } : template;
  
          const { dx, dy } = delta;
          const destination = { x: x + dx, y: y + dy};
  
          const mapTile = await dispatch('checkMapLocation', destination);
  
          if(mapTile.entity){
            mapTile.entity.effect(self);
            if(mapTile.entity.uses === 1){
              await dispatch('removeEntity', {id: mapTile.entity.id} )
            }
          }
  
          

          if(mapTile.clip) {
            this.path = frames[key];
            this.x = destination.x;
            this.y = destination.y;
          }
        }catch(e){
          console.error(e);
        }
        // return result;
      },
      handleOffput(){
        this.path = frames[STATE.IDLE];
      },
      affect({hp}){
        this.hp += hp;
      },
      handlers,
      path:'Comp_boi_idle.gif',
      hp: 10,
    }))({x,y});

  }catch(e) {
    console.error(e);
  }
}
