import {axios, securePost} from '@/axios.js';
import {config} from '@/config.js';
import { v4 as uuidv4 } from 'uuid';


export const makeNewSample = () => ({
  _id: uuidv4(),
  tag: '',
  description: '',
  seller: 'seller',
  categories: ['Guitar', 'Am', '128 BPM'], //string
  bpm:'',
  key:'',
  tags: ['jazz','rnb','smooth influencercore'], //string
  cost: 0,
  slug:'',
  imgUrl:  require('@/assets/CaptAhab.jpg')
});

export default {
  namespaced: true,
  state: () => ({
    isLoaded: false,
    formData: {},
    fileBuffer: {},
    samples: {},
  }),
  getters:{ 
    fileName({fileBuffer:{name = ''} }){
      return name;
    },
    sampleArray({samples}){
      return Object.values(samples);
    }
  },
  actions:{ 
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

    async search({commit}, {page, description}){
      console.log('Searching', description);
      //TODO: Refactor uri management, the only required one is the api, should be auto injected
      const {data} = await securePost(axios, JSON.stringify({page, description}) , {slug: `${config.VUE_APP_API_SAMPLE_URI}`});

      //TODO: refactor to function that adds ids to stuff, this will be used extensively

      const value = data
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