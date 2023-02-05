import Vue from 'vue';
import {axios, securePostForm, securePostJson} from '/src/axios.js';
import moment from 'moment';
import {encodeFormBlob} from '/src/store/modules/form';
import {slugs} from '/src/slugs';
import { v4 as uuidv4 } from 'uuid';
import config from '/src/config';

const {VITE_COVER_ART_URI} = config;

export const SORT_TYPES = {
  LIST: 'LIST',
  GROUP: 'GROUP'
};

const DEFAULT_SAMPLE_PACK = {
  _id: null,
  name:'',
  description: '',
  imgUrl:'',
  samples: []
};

//TODO: Move into data model class...
export const makeNewSamplePack = (
  {
    _id,
    name = '',
    description = '',
    imgUrl ='',
    samples = []
  } = DEFAULT_SAMPLE_PACK) => (
  {
    _id,
    name,
    description,
    imgUrl,
    samples
});

//TODO: Move into factory pattern
export const makeSamplePackFromResult = ({samplePack, isNew = false}) => {
  const newSamplePack = {
    ...makeNewSamplePack({...samplePack}),
    imgUrl: `${VITE_COVER_ART_URI}${samplePack._id}.png`,
    lastRefresh: moment().valueOf(),
  };

  return {
    ...newSamplePack
  };
};

export default {
  namespaced: true,
  state: () => ({
    isLoaded: false,
    sortType: SORT_TYPES.LIST,
    nextResultIndex: 0,
    samplePacks: {},
    sortAsc: true,
    sortBy:'name',
  }),
  getters: {
    samplePackArray({samplePacks, nextResultIndex, sortBy, sortAsc}) {
      const sort = sortAsc ? 
        (a,b) => a[sortBy].localeCompare(b[sortBy]) :
        (a,b) => b[sortBy].localeCompare(a[sortBy]);

      const result = Object.values(samplePacks);
      if(nextResultIndex === -1) return result.sort(sort);

      const sampleCount = Object.keys(samplePacks).length;
      const nextIndex = sampleCount < nextResultIndex ? sampleCount : nextResultIndex;
      return result.slice(0, nextIndex).reverse();
    },
  },
  actions: {
    initialize({dispatch}, {page}){
      return dispatch('search', {page});
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
    async search({ dispatch, commit, state:{ nextResultIndex: _nextResultIndex, query: _query = '' }}, { query = '', index = 0 }) {
      if(query === _query && _nextResultIndex < 0) return;

      const {
        data:{ data, nextResultIndex }} = await securePostJson(
        axios,
        JSON.stringify({query, index}),
        { slug: slugs.SamplePackSearch }
      );

      commit('assignObject', {key: 'query', value: query});

      const sampleCount = Object.keys(data).length;
      const nextIndex = sampleCount < nextResultIndex ? -1 : nextResultIndex;
      
      commit('assignObject', {key: 'nextResultIndex', value: nextIndex});
      dispatch('addSamplePacks', {newSamplePacks: data, index});
    },
    addSamplePacks({commit}, {newSamplePacks, isNew = false, index = 0}){
      const initSamplePacks = newSamplePacks.map(samplePack => makeSamplePackFromResult({samplePack, isNew}));
      const result = initSamplePacks.reduce((acc, samplePack) => {
          acc[samplePack._id] = samplePack;
          return acc;
        }, {});
      commit('samplePacks', index > 0 ? {...samplePack,  ...result } : {...result});

      return initSamplePacks;
    },
    async uploadSamplePack(ctx, {samplePack, imageBlob}) {
      const form = new FormData();
      const imageFileName = encodeFormBlob({ form, key: uuidv4(), blob: imageBlob });

      const samplePackRequest = {
        name: samplePack.name,
        description: samplePack.description,
        imageFileName,
        sampleRequests: []
      }

      const keys = Object.keys(samplePack.sampleData);
      for(let i = 0; i < keys.length; i++) {
        const sample = samplePack.sampleData[keys[i]];
        const sampleFileName = encodeFormBlob({ form, key: `sample-${sample._tempId}`, blob: sample.sampleBlob });
      
        samplePackRequest.sampleRequests.push({
          ...sample,
          sampleFileName
        });
      }

      form.append('data', JSON.stringify(samplePackRequest));

      await securePostForm(
        axios,
        form,
        { slug: slugs.SamplePackUpload }
      );
    },
    setSortType({commit}, sortType){      
      commit('sortType', sortType);
    },
  },
  mutations: {
    samplePacks(state, value){
      Vue.set(state, 'samplePacks', value);
    },
    sortType(state, value) {
      state.sortType = value;
    }
  }
}