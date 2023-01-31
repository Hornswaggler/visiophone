import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';
import {axios, securePostJson, securePostForm} from '/src/axios.js';
import config from '/src/config.js';
import moment from 'moment';

const DEFAULT_SAMPLE = {
  _id: null,
  name:'',
  sampleFile: {},
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

//TODO: Move into data model class...
export const makeNewSample = (
  {
    _id,
    name = '',
    fileId = '',
    tag = '',
    description = '',
    seller = '',
    bpm = '120.0',
    cost = "",
    imgUrl = '', 
    clipUri = '',
    sampleFile = {},
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

//TODO: Move into factory pattern
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
};

const encodeFormBlob = ({form, key, blob }) => {
  const filename = `${key}${blob.name.slice(blob.name.lastIndexOf('.'))}`;
  form.append(filename, blob);
  return filename;
};

const addSamplePackToForm = (form, {sampleData, sample, imageBlob}) => {
  const requestId = uuidv4();

  const sampleFileName = encodeFormBlob({ form, key: `sample-${requestId}`, blob: sample });
  const imageFileName = encodeFormBlob({ form, key: `image-${requestId}`, blob: imageBlob });

  const sampleRequest = {
    requestId,
    sampleMetadata: sampleData,
    sampleFileName,
    imageFileName
  };

  return sampleRequest;
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

    async uploadSample({dispatch}, {samplePack, sampleBlobs, imageBlob}) {
      const form = new FormData();
      encodeFormBlob({ form, key: `image`, blob: imageBlob });

      const samplePackRequest = {
        name: samplePack.name,
        description: samplePack.description,
        sampleRequests: []
      }

      const keys = Object.keys(samplePack.sampleData);
      for(let i = 0; i < keys.length; i++) {
        const sample = samplePack.sampleData[keys[i]];
        console.log('SAMPLE: ', sample);

        const sampleFileName = encodeFormBlob({ form, key: `sample-${sample._tempId}`, blob: sample.sampleBlob });
      
        samplePackRequest.sampleRequests.push({
          ...sample,
          sampleFileName
        });
      }

      form.append('data', JSON.stringify(samplePackRequest));

      // TODO: Fix this.
      await securePostForm(axios, form, {slug: `${config.VITE_API_SAMPLE_PACK_UPLOAD_URI}`});

      // const {data} = await securePostForm(axios, form, {slug: `${config.VITE_API_SAMPLE_UPLOAD_URI}`});
      // data.imgUrl = imageSrc;
      // return dispatch('addSamples', {samples: data, index: 1, isNew: true});
    },

    async uploadSamplePack({dispatch}, {name, samples}){
      let fd = new FormData();

      const imageFileName = encodeFormBlob({ form, key: `sample-${requestId}`, blob: imageBlob });

      for({sampleData, sample, image} in samples) {
        const sampleRequest = addSamplePackToForm(fd, {sampleData, sample, image});
      }

      await securePostForm(axios, fd, {slug: `${config.VITE_API_SAMPLE_PACK_UPLOAD_URI}`})
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