import { makeEntity } from "./Entity";
import { ENTITY_TYPE } from "./EntityConfig";
import { STATE } from "./PlayerConfig";
import { Path } from "rot-js";

// RNG.setSeed(12345);

export const MONKEY_STATE_MAP = {
  [STATE.MOVE_UP]: {
    handler: () => ({ dy: -1 }),
    path: "monkeh_bacc.gif",
  },
  [STATE.MOVE_DOWN]: {
    handler: () => ({ dy: 1 }),
    path: "monkeh.gif",
  },
  [STATE.MOVE_RIGHT]: {
    handler: () => ({ dx: 1 }),
    path: "monkeh_right.gif",
  },
  [STATE.MOVE_LEFT]: {
    handler: () => ({ dx: -1 }),
    path: "monkeh_leftt.gif",
  },
  [STATE.IDLE]: {
    path: "monkeh.gif",
  },
};

export default ({ x, y }) => {
  try {
    return new (({ x, y }) => ({
      ...makeEntity({ x, y, type: ENTITY_TYPE.MONKEY, zIndex: 3 }),
      async activate({ mapData, self: { x, y }, target }) {
        const dijkstra = new Path.AStar(target.x, target.y, (x, y) => {
          try {
            return (
              mapData[x] != undefined &&
              mapData[x][y] !== undefined &&
              !mapData[x][y].isBoundary
            );
          } catch (e) {
            console.error(e);
            return false;
          }
        });

        const path = [];
        dijkstra.compute(x, y, function (x, y) {
          path.push({ x, y });
        });

        if (path.length >= 2) {
          const { x: dx, y: dy } = path[1];
          this.x = dx;
          this.y = dy;
        }
      },
      path: "monkeh.gif",
      hp: 10,
    }))({ x, y });
  } catch (e) {
    console.error(e);
  }
};
