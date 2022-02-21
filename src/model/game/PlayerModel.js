import { makeEntity } from './Entity';
import {ENTITY_TYPE} from './EntityConfig';
import { KEYS, STATE_MAP, STATE } from './PlayerConfig';

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
  return new (({x,y}) => ({
    ...makeEntity(),
    type: ENTITY_TYPE.PLAYER,
    async handleInput({dispatch},{key}) {
      const {x, y, handlers} = this;
      const template = { dx: 0, dy: 0 };
      const delta = handlers[key] ? { ...template, ...handlers[key]() } : template;

      const { dx, dy } = delta;
      const destination = { x: x + dx, y: y + dy};
      const canMove = await dispatch('checkMapLocation', destination);
      if(canMove) {
        this.path = frames[key];
        this.x = destination.x;
        this.y = destination.y;
      }

    },
    handleOffput(){
      this.path = frames[STATE.IDLE];
    },
    handlers,
    path:'',
    hp: 10,
    ...{x,y}
  }))({x,y});
}
