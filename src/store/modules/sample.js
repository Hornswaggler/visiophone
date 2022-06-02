import {axios, securePost} from '@/axios.js';

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
    async uploadBuffer({state:{fileBuffer}}, accessToken) {
      console.log('Uploading Buffer', fileBuffer);
      const headers = { 'Content-Type': 'multipart/form-data' };
      try {

        const config = { headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization:': `Bearer ${accessToken}`
        } };
        let fd = new FormData();
        fd.append('file',fileBuffer)

        // const {status} = await axios.post('http://localhost:7071/api/upload_sample', fd, { headers });
        
        const result = await securePost(axios, fd, {slug: 'secure/upload_sample'});
        
        // res.data.files;
        // res.status;
        console.log('status: ', status);
      } catch(e) {
        console.error(e);
      }
    },
    setFileBuffer({commit}, fileBuffer){
      commit('assignObject', { key: 'fileBuffer', value: fileBuffer });
    }
  },
}