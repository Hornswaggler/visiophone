import {axios, securePost} from '@/axios.js';
import {config} from '@/config.js';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const makeNewSample = () => ({
  _id: uuidv4(),
  tag: '',
  description: '',
  seller: 'Seller',
  categories: ['Guitar', 'Am', '128 BPM'], //string
  bpm:'',
  key:'',
  tags: ['jazz','rnb','smooth influencercore'], //string
  cost: 0,
  slug:'',
  imgUrl:  require('@/assets/46.-Funkadelic-‘Maggot-Brain-1971-album-art-billboard-1240.webp'),
  fileId:'',
  clipUri:''
});

const makeSampleFromResult = ({samples}) => 
  samples
    .map(sample => ({
      ...makeNewSample(),
      ...sample,
      lastRefresh: moment().valueOf()
    }))
    .map((sample) => ({
      ...sample,
      clipUri: `${config.VUE_APP_CLIP_URI}${sample.fileId}.mp3`,
      categories: sample.categories
        .map((category, id) => ({
          id,
          name: category
        })),
      tags: sample.tags
        .map((tag, id) => ({
          id,
          name: tag
        }))
    }))
    .reduce((acc, sample) => {
      acc[sample._id] = sample;
      return acc;
    }, {});
  

export const SORT_TYPES = {
  LIST: 'LIST',
  GROUP: 'GROUP'
};

export default {
  namespaced: true,
  state: () => ({
    isLoaded: false,
    formData: {},
    fileBuffer: {},
    samples: {},
    nextResultIndex: 0,
    query: '',
    sortType: SORT_TYPES.LIST,
  }),
  getters:{ 
    fileName({fileBuffer:{name = ''} }){
      return name;
    },
    sampleArray({samples, nextResultIndex}){
      const result = Object.values(samples);
      if(nextResultIndex === -1) return result;

      const sampleCount = Object.keys(samples).length;
      const nextIndex = sampleCount < nextResultIndex ? sampleCount : nextResultIndex;
      return result.slice(0, nextIndex);
    },

  },
  actions:{
    initialize({dispatch}, {page, token}){
      return dispatch('search', {page, token});
    },
    async loadMoreSamples({dispatch, commit, state:{nextResultIndex: _nextResultIndex, query, samples: _samples}},{token}) {
      if(_nextResultIndex === -1) return;
      const sampleCount = Object.keys(samples).length;
      const nextIndex = sampleCount < nextResultIndex ? sampleCount : nextResultIndex;

      await dispatch('search', {query, token, index: _nextResultIndex});
    },
    uploadBuffer({state:{fileBuffer},dispatch}, {sampleData, token}) {
      try {
        let fd = new FormData();
        fd.append('file',fileBuffer)
        fd.append('data', JSON.stringify(sampleData));
        return securePost(axios, fd, {slug: `${config.VUE_APP_API_SAMPLE_UPLOAD_URI}`, token});
      } catch(e) {
        console.error(e);
      } finally {
        dispatch('setFileBuffer', {});
      }
    },
    
    // TODO: these can be generated ...
    setFileBuffer({commit}, fileBuffer){
      commit('assignObject', { key: 'fileBuffer', value: fileBuffer });
    },

    setIsLoaded({commit}, isLoaded){
      commit('assignObject', {key: 'isLoaded', value: isLoaded});
    },

    setSortType({commit}, sortType){      
      commit('assignObject', {key: 'sortType', value: sortType});
    },

    setIsLoaded({commit}, isLoaded){
      commit('assignObject', {key: 'isLoaded', value: isLoaded});
    },

    async search({commit, state:{nextResultIndex: _nextResultIndex, samples: _samples}}, {query, token, index = 0}){
      //TODO: Refactor uri management, the only required one is the api, should be auto injected
       const {data:{samples, nextResultIndex}} = await securePost(
        axios,
        JSON.stringify({query, index}),
        {slug: `${config.VUE_APP_API_SAMPLE_SEARCH_URI}`, token}
      );

      //TODO: refactor to function that adds ids to stuff, this will be used extensively
      commit('assignObject', {key: 'query', value: query});



      const sampleCount = Object.keys(samples).length;
      const nextIndex = sampleCount < nextResultIndex ? -1 : nextResultIndex;
      

      commit('assignObject', {key: 'nextResultIndex', value: nextIndex});

      const newSamples = makeSampleFromResult({samples});

      const value = index > 0 ? {..._samples,  ...newSamples } : {...newSamples};

      commit('assignObject', {
        key: 'samples',
        value
      });
    }
  },
}