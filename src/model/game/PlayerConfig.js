export const STATE = {
  MOVE_UP: "MOVE_UP",
  MOVE_DOWN: "MOVE_DOWN",
  MOVE_LEFT: "MOVE_LEFT",
  MOVE_RIGHT: "MOVE_RIGHT",
  IDLE: "IDLE"
};

export const KEYS = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight"
};

export const STATE_MAP = {
  [STATE.MOVE_UP]: {
    key: KEYS.UP,
    handler: () => ({ dy: -1 }),
    path: 'Comp_boi_walkin_butt.gif'
  },
  [STATE.MOVE_DOWN]: {
    key: KEYS.DOWN,
    handler: () => ({ dy: 1 }),
    path: 'Comp_boi_walkin.gif'
  },
  [STATE.MOVE_RIGHT]: {
    key: KEYS.RIGHT,
    handler: () => ({ dx: 1 }), 
    path: 'Comp_boi_walkin_right.gif'
  },
  [STATE.MOVE_LEFT]: {
    key: KEYS.LEFT, 
    handler: () => ({ dx: -1 }), 
    path: 'Comp_boi_walkin_left.gif'
  },
  [STATE.IDLE]: {
    path: 'Comp_boi_idle.gif'
  }
};