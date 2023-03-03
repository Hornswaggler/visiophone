import Vue from 'vue';
import user from './user';
import app from './app';
import sample from './sample';
import samplePack from './samplePack';
import samplePackEdit from './samplePackEdit';
import dropdown from './dropdown';
import form from './form';
import cart from './cart';
import nav from './nav';
import audioPlayer from './audioPlayer';

const store = {
  user,
  app,
  sample,
  samplePack,
  samplePackEdit,
  dropdown,
  form,
  cart,
  nav,
  audioPlayer
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