import { v4 as uuidv4 } from 'uuid';

export const makeEntity = ({x, y, type}) => ({
  id: uuidv4(), 
  x, y,
  clip: true,
  type
});