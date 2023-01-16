import Vue from 'vue';
import {axios, securePostJson, securePostForm} from '/src/axios.js';
import config from '/src/config.js';
import moment from 'moment';

const DEFAULT_SAMPLE = {
  _id: null,
  name:'',
  fileId: '',
  tag: '',
  description: '',
  seller: '',
  bpm: '120.0',
  cost: "100",
  imgUrl:'',
  clipUri:'',
  fileName:'',
  key: ''
};

export const makeNewSample = (
  {
    _id,
    name = '',
    fileId = '',
    tag = '',
    description = '',
    seller = '',
    bpm = '120.0',
    cost = "100",
    imgUrl = '', 
    clipUri = '', 
    fileName = '',
    key = ''
  } = DEFAULT_SAMPLE) => (
  {
    _id,
    name,
    fileId,
    tag,
    description,
    seller,
    bpm,
    cost,
    imgUrl,
    clipUri, 
    fileName,
    key
});

export const makeSampleFromResult = ({sample, isNew = false}) => {
  const newSample = {
    ...makeNewSample({...sample}),
    ...sample,
    lastRefresh: moment().valueOf(),
  };

  let imgUrl= newSample.imgUrl || '';
  if(newSample._id && !isNew) {
    imgUrl=`${config.VITE_COVER_ART_URI}${newSample._id}.png`;
  }

  let clipUri = newSample.clipUri || '';
  if(newSample._id && !isNew) {
    clipUri = `${config.VITE_CLIP_URI}${newSample._id}.wav.ogg`;
  }

  return {
    ...newSample,
    imgUrl,
    clipUri
  };
}

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
    formData: {},
    fileBuffer: {},
    samples: {},
    nextResultIndex: 0,
    query: '',
    sortType: SORT_TYPES.LIST,
    samplePurchaseUrl: config['VITE_API_SAMPLE_PURCHASE'],
    sampleTableDefinition: {
      columns: [
        { 
          ratio:'1',
          name:'Image',
          isSort: false,
          show:false
        },
        { 
          ratio:'2',
          name: 'Title',
          path: 'description',
          isSort: true,
          show: true
        },
        {
          ratio:'2',
          name: 'Genre',
          path: 'tag',
          isSort: true,
          show: true
        },
        {
          ratio:'1',
          name: 'BPM',
          path: 'bpm',
          isSort: true,
          show: true
        },
        {
          ratio:'1',
          name: 'Cost',
          path: 'cost',
          isSort: false,
          show: true

        },
        {
          ratio:'1',
          name: 'Buy',
          isSort: false,
          show: false
        }
      ].map((col, _id) => ({...col, _id}))
    }
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

    async uploadSample({dispatch}, {sampleData, sample, image, imageSrc}) {
      let fd = new FormData();
      fd.append('sample',sample);
      fd.append('image', image);
      fd.append('data', JSON.stringify(sampleData));

      const {data} = await securePostForm(axios, fd, {slug: `${config.VITE_API_SAMPLE_UPLOAD_URI}`});
      data.imgUrl = imageSrc;
      return dispatch('addSamples', {samples: [data], index: 1, isNew: true});
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
        { slug: `${config.VITE_API_SAMPLE_SEARCH_URI}` }
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