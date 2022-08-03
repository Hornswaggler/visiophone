import Vue from 'vue';
import draggable from './draggable';
import user from './user';
import app from './app';
import sample from './sample';
import dropdown from './dropdown';

const store = {
  draggable,
  user,
  app,
  sample,
  dropdown
};

const mutations = {
  setPrimitive(state, {key, value}){
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

export default result;