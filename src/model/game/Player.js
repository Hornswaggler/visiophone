import { v4 as uuidv4 } from 'uuid';

export const ENTITY_TYPE = {
  PLAYER:'PLAYER'
};

const MOVEMENTS = {
  MOVE_UP: "MOVE_UP",
  MOVE_DOWN: "MOVE_DOWN",
  MOVE_LEFT: "MOVE_LEFT",
  MOVE_RIGHT: "MOVE_RIGHT"
};

const KEYS = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight"
};

const CONTROL_MAP = {
  [MOVEMENTS.MOVE_UP]: { key: KEYS.UP, handler: () => ({dy:-1})},
  [MOVEMENTS.MOVE_DOWN]: { key: KEYS.DOWN, handler: () => ({dy:1})},
  [MOVEMENTS.MOVE_RIGHT]: { key: KEYS.RIGHT, handler: () => ({dx:1})},
  [MOVEMENTS.MOVE_LEFT]: { key: KEYS.LEFT, handler: () => ({dx:-1})}
};

const makeEntity =() => ({
  id: uuidv4(),
  x: 0,
  y: 0
});

const handlers = 
  Object.keys(CONTROL_MAP)
    .reduce((acc, key) => {
      console.log('Handle This');
      acc[CONTROL_MAP[key].key] = CONTROL_MAP[key].handler;
      return acc;
    },
  {});

export default () => 
  new (() => ({
    ...makeEntity(),
    type: ENTITY_TYPE.PLAYER,
    async handleInput({dispatch},{key}){
      console.log(key);
      const {x, y, handlers} = this;
      const template = { dx: 0, dy: 0 };
      const delta = handlers[key] ? { ...template, ...handlers[key]() } : template;

      const { dx, dy } = delta;
      const destination = { x: x + dx, y: y + dy};
      if(await dispatch('checkMapLocation',destination)){
        this.x = destination.x;
        this.y = destination.y;
      }

    },
    handlers,
  }));