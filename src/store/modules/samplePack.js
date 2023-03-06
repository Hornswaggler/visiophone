import Vue from 'vue';
import {axios, securePostForm, secureGet, securePostJson} from '/src/axios';
import {encodeFormBlob} from '/src/store/modules/form';
import {slugs} from '/src/slugs';
import { v4 as uuidv4 } from 'uuid';
import { SORT_TYPES, makeSamplePackFromResult } from '/src/models/samplePackFactory';

export default {
  namespaced: true,
  state: () => ({
    isLoaded: false,
    sortType: SORT_TYPES.LIST,
    nextResultIndex: 0,
    samplePacks: {},
    sortAsc: true,
    sortBy:'name',
    selectedSamplePack: {}
  }),
  getters: {
    samplePackArray({samplePacks, sortBy, sortAsc}) {
      const sort = sortAsc ? 
        (a,b) => a[sortBy].localeCompare(b[sortBy]) :
        (a,b) => b[sortBy].localeCompare(a[sortBy]);

      const result = Object.values(samplePacks);
      return result.sort(sort);
    },
  },
  actions: {
    initialize({dispatch}, {page}){
      return dispatch('search', {page});
    },

    async getSamplePackById({state:{samplePacks}, dispatch, commit}, id) {
      let selectedSamplePack;
      if(samplePacks != '' && samplePacks[id]){
        selectedSamplePack = samplePacks[id];
      } else {
        const {data} = await secureGet(axios, {slug: `${slugs.SamplePackGetById}/${id}`});
        selectedSamplePack = await dispatch('addSamplePack', data);
      }
      commit('selectedSamplePack', selectedSamplePack);
      return selectedSamplePack;
    },

    async loadMoreSamples({dispatch, state:{nextResultIndex: _nextResultIndex, query, samples: _samples}}) {
      //TODO Endpoints should come from env
      await dispatch('search', {query, index: _nextResultIndex});
    },

    orderBy({state:{sortBy, sortAsc}, commit}, column) {
      if(!column.path) return;

      if(sortBy !== column.path) {
        commit('assignObject', {key: 'sortBy', value: column.path});
        commit('assignObject', { key: 'sortAsc', value: true} );
      }
      else {
        commit('assignObject', { key: 'sortAsc', value: !sortAsc});
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
      commit('assignObject', {key: 'nextResultIndex', value: nextResultIndex});
      dispatch('addSamplePacks', {newSamplePacks: data, index});
    },

    async addSamplePack({dispatch}, samplePack) {
      return (await dispatch('addSamplePacks', {newSamplePacks: [samplePack]}))[0];
    },

    addSamplePacks({commit, state:{samplePacks}}, {newSamplePacks, isNew = false, index = 0}){
      const initSamplePacks = newSamplePacks.map(samplePack => makeSamplePackFromResult({samplePack, isNew}));

      const result = initSamplePacks.reduce((acc, samplePack) => {
          acc[samplePack.id] = samplePack;
          return acc;
        }, {});

      commit('samplePacks', index > 0 ? {...samplePacks,  ...result } : {...result});

      return initSamplePacks;
    },

    async uploadSamplePack(ctx, {samplePack, imageBlob}) {
      const form = new FormData();
      const imgUrl = encodeFormBlob({ form, key: uuidv4(), blob: imageBlob });

      const samplePackRequest = {
        name: samplePack.name,
        description: samplePack.description,
        cost: samplePack.cost,
        imgUrl,
        samples: []
      }

      const keys = Object.keys(samplePack.samples);
      for(let i = 0; i < keys.length; i++) {
        const sample = samplePack.samples[keys[i]];
        const clipUri = encodeFormBlob({ form, key: `sample-${sample._tempId}`, blob: sample.sampleBlob });
      
        samplePackRequest.samples.push({
          ...sample,
          clipUri
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

    setIsLoaded({commit}, isLoaded){
      commit('isLoaded', isLoaded);
    },
  },
  mutations: {
    samplePacks(state, value){
      Vue.set(state, 'samplePacks', value);
    },

    sortType(state, value) {
      state.sortType = value;
    },

    isLoaded(state, value) {
      state.isLoaded = value;
    },

    selectedSamplePack(state, selectedSamplePack){
      Vue.set(state, 'selectedSamplePack', selectedSamplePack);
    }
  }
}