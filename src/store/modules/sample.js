import {encodeFormBlob} from '/src/store/modules/form';
import Vue from 'vue';
import {axios, securePostJson, securePostForm} from '/src/axios.js';
import config from '/src/config.js';
import moment from 'moment';
import { slugs } from '/src/slugs';

const DEFAULT_SAMPLE = {
  _id: null,
  name:'',
  sampleFile: {},
  tag: '',
  description: '',
  seller: '',
  bpm: '120.0',
  cost: "100",
  clipUri:'',
  fileName:'',
  key: ''
};

//TODO: Move into data model class...
export const makeNewSample = (
  {
    _id,
    name = '',
    tag = '',
    description = '',
    seller = '',
    bpm = '120.0',
    cost = "",
    clipUri = '',
    sampleFile = {},
    fileName = '',
    key = ''
  } = DEFAULT_SAMPLE) => (
  {
    _id,
    name,
    tag,
    description,
    seller,
    bpm,
    cost,
    clipUri,
    sampleFile,
    fileName,
    key
});

//TODO: Move into factory pattern
export const makeSampleFromResult = ({sample, isNew = false}) => {
  const newSample = {
    ...makeNewSample({...sample}),
    ...sample,
    lastRefresh: moment().valueOf(),
  };

  let clipUri = newSample.clipUri || '';
  if(newSample._id && !isNew) {
    clipUri = `${config.VITE_CLIP_URI}${newSample._id}.wav.ogg`;
  }

  return {
    ...newSample,
    imgUrl,
    clipUri
  };
};

export const SORT_TYPES = {
  LIST: 'LIST',
  GROUP: 'GROUP'
};

export default {
  namespaced: true,
  state: () => ({
    sortBy:'description',
    sortAsc: true,
    sampleForEdit: {},
    isLoaded: false,
    samples: {},
    nextResultIndex: 0,
    query: '',
    sortType: SORT_TYPES.LIST
  }),
  getters: {
    sampleArray({samples, nextResultIndex, sortBy, sortAsc}) {
      const sort = sortAsc ? 
        (a,b) => a[sortBy].localeCompare(b[sortBy]) :
        (a,b) => b[sortBy].localeCompare(a[sortBy]);

      const result = Object.values(samples);
      if(nextResultIndex === -1) return result.sort(sort);

      const sampleCount = Object.keys(samples).length;
      const nextIndex = sampleCount < nextResultIndex ? sampleCount : nextResultIndex;
      return result.slice(0, nextIndex).reverse();
    },
  },
  actions:{
    persistToStorage({commit}, sample){
      commit(
        'assignObject', 
        {
          key: 'sampleForEdit', 
          value: sample
        })
    },

    orderBy({state:{sortBy, sortAsc}, commit}, column) {
      if(!column.path) return;

      if(sortBy !== column.path) {
        commit('assignObject', {key: 'sortBy', value: column.path});
        commit('assignObject', { key: 'sortAsc', value: true} );
      }
      else {
        commit('assignObject', { key: 'sortAsc', value: !sortAsc} );
      }
    },

    initialize({dispatch}, {page}){
      return dispatch('search', {page});
    },

    async loadMoreSamples({dispatch, state:{nextResultIndex: _nextResultIndex, query, samples: _samples}}) {
      await dispatch('search', {query, index: _nextResultIndex});
    },

    async uploadSample(ctx, {sample}){
      let form = new FormData();

      const sampleFileName = encodeFormBlob({ form, key: `sample`, blob: sample.sampleBlob });
      const sampleRequest = {
        ...sample,
        sampleFileName
      };

      form.append('data', JSON.stringify(sampleRequest));

      await securePostForm(axios, form, {slug: slugs.SampleUpload});
    },

    setIsLoaded({commit}, isLoaded){
      commit('assignObject', {key: 'isLoaded', value: isLoaded});
    },

    setSortType({commit}, sortType){      
      commit('assignObject', {key: 'sortType', value: sortType});
    },

    addSamples({commit,state:{samples}}, {samples: newSamples, index = 0, isNew = false}){
      const initSamples = newSamples.map(sample => makeSampleFromResult({sample, isNew}));
      const result = initSamples.reduce((acc, sample) => {
          acc[sample._id] = sample;
          return acc;
        }, {});
      
      const value = index > 0 ? {...samples,  ...result } : {...result};

      commit('samples', value);

      return initSamples;
    },

    async search({ dispatch, commit, state:{ nextResultIndex: _nextResultIndex, query: _query = '' }}, { query = '', index = 0 }) {
      if(query === _query && _nextResultIndex < 0) return;

      const {
        data:{ samples, nextResultIndex }} = await securePostJson(
        axios,
        JSON.stringify({query, index}),
        { slug: slugs.SampleSearch }
      );

      commit('assignObject', {key: 'query', value: query});

      const sampleCount = Object.keys(samples).length;
      const nextIndex = sampleCount < nextResultIndex ? -1 : nextResultIndex;
      
      commit('assignObject', {key: 'nextResultIndex', value: nextIndex});

      dispatch('addSamples', {samples, index});
    }
  },
  mutations: {
    samples(state, value){
      Vue.set(state, 'samples', value);
    }
  }
}