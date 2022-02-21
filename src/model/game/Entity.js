import { v4 as uuidv4 } from 'uuid';
import {ENTITY_TYPE} from './EntityConfig';

export const makeEntity =() => ({
  id: uuidv4(),
  x: 0,
  y: 0
});

export default () => 
  new (() => ({
    ...makeEntity(),
    type: ENTITY_TYPE.SPIKES,
  }));