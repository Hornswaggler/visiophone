import axios from '@/axios.js';

export default {
  namespaced: true,
  state: () => ({
    authenticated: true,
    username: ''
  }),
  actions:{
    async login({commit}, {username, password}) {
      const {data} = await axios.request({
        method: 'post',
        url: "https://visiophone.wtf/api/login",
        timeout: 10000,
        data: {username, password}
      });

      if(data) commit('authenticated', data);
      
      return data;
    },
  },
  mutations:{
    authenticated(state, authenticated){
      state.authenticated = authenticated;
    }
  }
};
