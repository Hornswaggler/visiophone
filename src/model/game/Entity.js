import { v4 as uuidv4 } from 'uuid';

export const makeEntity = ({x, y, type}) => ({
  id: uuidv4(), 
  x, y,
  dx:0, 
  dy:0,
  clip: true,
  type,
  effect: () => {},
  zIndex: 2
});