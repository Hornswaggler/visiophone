import Vue from 'vue';
import user from './user';
import app from './app';
import sample from './sample';
import samplePack from './samplePack';
import dropdown from './dropdown';
import form from './form';

const store = {
  user,
  app,
  sample,
  samplePack,
  dropdown,
  form
};

const initFromStorage = context => {
};

const persistToStorage = ({commit}, {key,value}) => {
};

const actions = {
  initFromStorage,
  persistToStorage,
};

const mutations = {
  setPrimitive(state, {key, value}) {
    state[key] = value;
  },

  addAll(state, {key, values}) {
    values.forEach(value => {
      state[key].push(value);
    });
  },

  assignObject(state, {key, value}) {
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
      },
      actions: {
        ...actions,
        ...store[key].actions,
      }
    }
  };
  return acc;
},{});

export default result;