import { makeEntity } from './Entity';
import { ENTITY_TYPE } from './EntityConfig';
import { STATE_MAP, STATE } from './PlayerConfig';

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
        const template = { dx: 0, dy: 0 };
        const delta = handlers[key] ? { ...template, ...handlers[key]() } : template;

        const { dx, dy } = delta;
        const destination = { x: x + dx, y: y + dy};

        const result = await dispatch('checkMapLocation', destination);

        if(result.entity){
          result.entity.effect(self);
          if(result.entity.uses === 1){
            dispatch('removeEntity', {id: result.entity.id} )
          }
        }

        if(result.clip) {
          this.path = frames[key];
          this.x = destination.x;
          this.y = destination.y;
        }

      },
      handleOffput(){
        this.path = frames[STATE.IDLE];
      },
      affect({hp}){
        this.hp += hp;
      },
      handlers,
      path:'',
      hp: 10,
    }))({x,y});

  }catch(e) {
    console.error(e);
  }
}
