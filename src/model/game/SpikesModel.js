import { makeEntity } from './Entity';
import {ENTITY_TYPE} from './EntityConfig';

export default ({x,y}) => {
  return new (({x,y}) => ({
    ...makeEntity({
      x, y, 
      clip: false,
      type: ENTITY_TYPE.SPIKES,
      path: 'Spikes.png',

    }),
    effect: (entity) => {
      
      entity.affect({hp: -1})
    }
  })) ({x,y});
}
