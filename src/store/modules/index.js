import Vue from 'vue';
import draggable from './draggable';
import user from './user';
import app from './app';
import game from './game';
import sample from './sample';

const store = {
  draggable,
  user,
  app,
  game,
  sample
};

console.log('Building Store');

const mutations = {
  setPrimitive(state, {key, value}){
    console.log('mutating primitive:', key, value, state);
    state[key] = value;
  },

  addAll(state, {key, values}){
    values.forEach(value => {
      state[key].push(value);
    });
  },

  assignObject(state, {key, value}){
    Vue.set(state, key, value);
  }
};

const result = Object.keys(store).reduce((acc, key) => {
  acc[key] = {
    ...store[key],
    ...{
      mutations:{
        ...mutations,
        ...store[key].mutations
      }
    }
  };
  return acc;
},{});

console.log('asdf', result);

export default result;