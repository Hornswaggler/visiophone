import { makeEntity } from './Entity';
import {ENTITY_TYPE} from './EntityConfig';

export default ({x,y}) => {
  return new (({x,y}) => ({
    ...makeEntity({
      x, y, 
      clip: false,
      type: ENTITY_TYPE.HEART
    }),
    path: 'Heart.png',
    uses: 1,
    effect: (entity) => {
      entity.affect({hp: 1})
    }
  })) ({x,y});
}
