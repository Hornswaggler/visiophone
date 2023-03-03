import {encodeFormBlob} from '/src/store/modules/form';
import Vue from 'vue';
import {axios, securePostJson, securePostForm} from '/src/axios.js';
import { slugs } from '/src/slugs';

import { SORT_TYPES, makeSampleFromResult} from '@/models/sampleFactory';

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
          acc[sample.id] = sample;
          return acc;
        }, {});
      
      const value = index > 0 ? {...samples,  ...result } : {...result};

      commit('samples', value);

      return initSamples;
    },

    async search({ dispatch, commit, state:{ nextResultIndex: _nextResultIndex, query: _query = '' }}, { query = '', index = 0 }) {
      if(query === _query && _nextResultIndex < 0) return;

      const {
        data:{ samples, nextResultIndex }
      } = await securePostJson(
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