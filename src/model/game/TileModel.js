import { makeEntity } from "./Entity";
import { ENTITY_TYPE } from "./EntityConfig";

export default ({ x, y, path }) => {
  return new (({ x, y, path }) => ({
    ...makeEntity({
      x,
      y,
      clip: false,
      type: ENTITY_TYPE.TILE,
    }),
    path,
    zIndex: 1,
  }))({ x, y, path });
};
