import {axios, securePost, secureGet} from '@/axios.js';
import {config} from '@/config.js'

export const makeNewSample = () => ({
  tag: '',
  description: '',
  seller: 'seller',
  categories: ['Guitar', 'Am', '128 BPM'], //string
  bpm:'',
  key:'',
  tags: ['jazz','rnb','smooth influencercore'], //string
  cost: 0,
  slug:'',
});

export default {
  namespaced: true,
  state: () => ({
    formData: {},
    fileBuffer:{}
  }),
  getters:{ 
    fileName({fileBuffer:{name = ''} }){
      return name;
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
    
    setFileBuffer({commit}, fileBuffer){
      commit('assignObject', { key: 'fileBuffer', value: fileBuffer });
    },

    async getAll(){
      const {data} = await secureGet(axios, {slug: '/sample'});

      // const result = ;

      return data
      .map(sample => ({
        ...makeNewSample(),
        ...sample,
      }))
      .map((sample,id) => ({
        id,
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
      }));          
    }
  },
}