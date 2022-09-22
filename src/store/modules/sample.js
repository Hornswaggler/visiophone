import {axios, securePostJson, securePostForm} from '@/axios.js';
import {config} from '@/config.js';
import moment from 'moment';

export const makeNewSample = ({_id = '', fileId = ''} = {_id: '', fileId: ''}) => ({
  _id,
  fileId,
  tag: '',
  description: '',
  seller: 'Seller',
  categories: ['Guitar', 'Am', '128 BPM'],
  bpm:'',
  key:'',
  tags: ['jazz','rnb','smooth influencercore'],
  cost: 0,
  slug:'',
  imgUrl: `${config.VUE_APP_COVER_ART_URI}${_id}.png`,
  clipUri:`${config.VUE_APP_CLIP_URI}${fileId}.ogg`,
});

const makeSampleFromResult = sample => {
  const newSample = {
    ...makeNewSample(sample),
    ...sample,
    lastRefresh: moment().valueOf(),
  };

  return {
    ...newSample,
    categories: newSample.categories
      .map((category, id) => ({
        id,
        name: category
      })),
    tags: newSample.tags
      .map((tag, id) => ({
        id,
        name: tag
      }))
  };
} 

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
    fileName({ fileBuffer:{name = ''} }){
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
    initFromStorage({commit}, {samples}){
      const value = Object.keys(samples).map(key => {
        const sample = samples[key];
        if((sample.imgUrl || '').startsWith('blob')) {
          sample.imgUrl = `${config.VUE_APP_COVER_ART_URI}${sample._id}.png`;
        }

        return makeSampleFromResult(sample);
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

    async uploadSample({dispatch}, {sampleData, token, sample, image, imageSrc}) {
      try {
        let fd = new FormData();
        fd.append('sample',sample);
        fd.append('image', image);
        fd.append('data', JSON.stringify(sampleData));

        const {data} = await securePostForm(axios, fd, {slug: `${config.VUE_APP_API_SAMPLE_UPLOAD_URI}`, token});
        data.imgUrl = imageSrc;
        dispatch('addSamples', {samples:[data], index: 1});
      } catch(e) {
        console.error(e);image
      }
    },

    setIsLoaded({commit}, isLoaded){
      commit('assignObject', {key: 'isLoaded', value: isLoaded});
    },

    setSortType({commit}, sortType){      
      commit('assignObject', {key: 'sortType', value: sortType});
    },

    addSamples({commit,state:{samples}}, {samples: newSamples, index = 0}){
      const initSamples = newSamples.map(sample => makeSampleFromResult(sample));
      const result = initSamples.reduce((acc, sample) => {
          acc[sample._id] = sample;
          return acc;
        }, {});
      
      const value = index > 0 ? {...samples,  ...result } : {...result};

      commit('assignObject', {
        key: 'samples',
        value
      });
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