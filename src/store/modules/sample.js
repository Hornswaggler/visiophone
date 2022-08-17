import {axios, securePost} from '@/axios.js';
import {config} from '@/config.js';
import { v4 as uuidv4 } from 'uuid';

// TODO: Should be configurable
const BUFFER_CHUNK_SIZE = 10;

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
  imgUrl:  require('@/assets/46.-Funkadelic-‘Maggot-Brain-1971-album-art-billboard-1240.webp')
});

const makeSampleFromResult = ({samples}) => 
  samples
    .map(sample => ({
      ...makeNewSample(),
      ...sample,
    }))
    .map((sample) => ({
      ...sample,
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
    loadedCount: 0,
    sortType: SORT_TYPES.LIST,
  }),
  getters:{ 
    fileName({fileBuffer:{name = ''} }){
      return name;
    },
    sampleArray({samples, loadedCount}){
      return Object.values(samples).slice(0, loadedCount);
    },
  },
  actions:{
    async loadMoreSamples({commit, state:{nextResultIndex: _nextResultIndex, query, samples: _samples}}) {
      if(_nextResultIndex === -1) return;

      const {data: { nextResultIndex , samples }} = await securePost(axios, JSON.stringify({query, index: _nextResultIndex}) , {slug: `${config.VUE_APP_API_SAMPLE_URI}`});
      
      const newSamples = makeSampleFromResult({samples});

      const value = {
        ..._samples, 
        ...newSamples
      };

      commit(
        'assignObject', 
        {
          key: 'nextResultIndex', 
          value: nextResultIndex
        }
      );

      commit(
        'assignObject', 
        {
          key: 'loadedCount', 
          value: Object.keys(value).length
        }
      );

      commit(
        'assignObject', 
        {
          key: 'samples', 
          value
        }
      );

    },
    uploadBuffer({state:{fileBuffer},dispatch}, sampleData) {
      try {
        let fd = new FormData();
        fd.append('file',fileBuffer)
        fd.append('data', JSON.stringify(sampleData));
        return securePost(axios, fd, {slug: `${config.VUE_APP_API_UPLOAD_SAMPLE_URI}`});
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

    async search({commit, state:{nextResultIndex: _nextResultIndex}}, {query}){
      //TODO: Refactor uri management, the only required one is the api, should be auto injected
      const {data:{samples, nextResultIndex}} = await securePost(axios, JSON.stringify({query, index: _nextResultIndex}) , {slug: `${config.VUE_APP_API_SAMPLE_URI}`});

      //TODO: refactor to function that adds ids to stuff, this will be used extensively
      commit('assignObject', {key: 'query', value: query});
      commit('assignObject', {key: 'nextResultIndex', value: nextResultIndex});
      commit('assignObject', {key: 'loadedCount', value: nextResultIndex});


      const value = samples
        .map(sample => ({
          ...makeNewSample(),
          ...sample,
        }))
        .map((sample) => ({
          ...sample,
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
        
        commit('assignObject', {
          key: 'samples',
          value
        });
    }
  },
}