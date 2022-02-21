import { makeEntity } from './Entity';
import {ENTITY_TYPE} from './EntityConfig';

export default ({x,y}) => {
  return new (({x,y}) => ({
    ...makeEntity(),
    path: 'Spikes.png',
    type: ENTITY_TYPE.SPIKES,
    ...{x,y}
  }))({x,y});
}
