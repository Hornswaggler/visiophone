import {axios, securePostJson, securePostForm} from '@/axios.js';
import {config} from '@/config.js';
import moment from 'moment';

const DEFAULT_SAMPLE = {
  _id: '',
  fileId: '',
  tag: '',
  description: '',
  seller: '',
  bpm: '120.0',
  cost: "0",
  imgUrl:'',
  clipUri:'',
  fileName:'',
};

export const makeNewSample = (
  {
    _id,
    fileId = '',
    tag = '',
    description = '',
    seller = '',
    bpm = '120.0',
    cost = "0",
    imgUrl = '', 
    clipUri = '', 
    fileName = ''
  } = DEFAULT_SAMPLE) => (
  {
    _id,
    fileId,
    tag,
    description,
    seller,
    bpm,
    cost,
    imgUrl,
    clipUri, 
    fileName,
});

export const makeSampleFromResult = ({sample, isNew = false}) => {
  const newSample = {
    ...makeNewSample({...sample}),
    ...sample,
    lastRefresh: moment().valueOf(),
  };

  let imgUrl= newSample.imgUrl || '';
  if(newSample._id && !isNew){
    imgUrl=`${config.VUE_APP_COVER_ART_URI}${newSample._id}.png`;
  }

  return {
    ...newSample,
    imgUrl
  };
} 

export const SORT_TYPES = {
  LIST: 'LIST',
  GROUP: 'GROUP'
};

export default {
  namespaced: true,
  state: () => ({
    sampleForEdit: {},
    isLoaded: false,
    formData: {},
    fileBuffer: {},
    samples: {},
    nextResultIndex: 0,
    query: '',
    sortType: SORT_TYPES.LIST,
  }),
  getters:{
    sampleArray({samples, nextResultIndex}){
      const result = Object.values(samples);
      if(nextResultIndex === -1) return result;

      const sampleCount = Object.keys(samples).length;
      const nextIndex = sampleCount < nextResultIndex ? sampleCount : nextResultIndex;
      return result.slice(0, nextIndex);
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

    initFromStorage({commit}, {samples}){
      const value = Object.keys(samples).map(key => {
        const sample = samples[key];
        if((sample.imgUrl || '').startsWith('blob')) {
          sample.imgUrl = `${config.VUE_APP_COVER_ART_URI}${sample._id}.png`;
        }

        return makeSampleFromResult({sample});
      });
      
      commit('assignObject', {key: 'samples', value })
    },

    initialize({dispatch}, {page, token}){
      return dispatch('search', {page, token});
    },

    async loadMoreSamples({dispatch, commit, state:{nextResultIndex: _nextResultIndex, query, samples: _samples}},{token}) {
      if(_nextResultIndex === -1) return;
      const sampleCount = Object.keys(samples).length;
      const nextIndex = sampleCount < nextResultIndex ? sampleCount : nextResultIndex;

      await dispatch('search', {query, token, index: _nextResultIndex});
    },

    async uploadSample({dispatch}, {sampleData, token, sample, image, imageSrc, accountId}) {
        let fd = new FormData();
        fd.append('sample',sample);
        fd.append('image', image);
        fd.append('accountId', accountId)
        fd.append('data', JSON.stringify(sampleData));

        const {data} = await securePostForm(axios, fd, {slug: `${config.VUE_APP_API_SAMPLE_UPLOAD_URI}`, token});
        data.imgUrl = imageSrc;
        return dispatch('addSamples', {samples:[data], index: 1, isNew:true});
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

      commit('assignObject', {
        key: 'samples',
        value
      });

      return initSamples;
    },

    async search({ dispatch, commit, state:{ nextResultIndex: _nextResultIndex }}, { query, token, index = 0 }){
       const { data:{ samples, nextResultIndex }} = await securePostJson(
        axios,
        JSON.stringify({query, index}),
        { slug: `${config.VUE_APP_API_SAMPLE_SEARCH_URI}`, token }
      );

      commit('assignObject', {key: 'query', value: query});

      const sampleCount = Object.keys(samples).length;
      const nextIndex = sampleCount < nextResultIndex ? -1 : nextResultIndex;
      
      commit('assignObject', {key: 'nextResultIndex', value: nextIndex});

      dispatch('addSamples', {samples, index});
    }
  },
}