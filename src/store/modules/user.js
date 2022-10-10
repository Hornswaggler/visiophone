import {securePostForm, securePostJson, axios } from '@/axios.js';
import {config} from '@/config.js';
import {makeSampleFromResult} from './sample';
import { initializeAuth, logon, logOff } from '@/auth';

export const makeNewUser = () => ({
  _id: localStorage._id || '',
  authenticated: false,
  publicStorageToken: '',
  apiToken:{},
  storageToken:{},
  avatarId: localStorage.avatarId || '',
  customUserName: localStorage.customUserName || '',
  samples: JSON.parse(localStorage.user_samples || "[]"),
  forSale: JSON.parse(localStorage.forSale || "[]"),
  owned: JSON.parse(localStorage.owned || "[]")
});

export default {
  namespaced: true,
  state: () => makeNewUser(),
  actions: {

    // persistToStorage({commit}, user){
    //   commit(
    //     'assignObject', 
    //     {
    //       key: 'user', 
    //       value: sample
    //     })
    // },

    initFromStorage({commit, state:{samples}}){
      const value = Object.keys(samples).map(key => {
        const sample = samples[key];
        if((sample.imgUrl || '').startsWith('blob')) {
          sample.imgUrl = `${config.VUE_APP_COVER_ART_URI}${sample._id}.png`;
        }
        return makeSampleFromResult({sample});
      });
      
      commit('assignObject', {key: 'samples', value })
    },

    async purchaseSample({ commit, state:{samples, accountId} }, {sample}) {
      const {data} = await securePostJson(
        axios,
        JSON.stringify({_id: sample._id, accountId}),
        { slug: `sample_purchase` }
      );

      const forSale = (data.forSale || []).map(sample => sample.sampleId);
      const owned = (data.owned || []).map(sample => sample.sampleId);

      commit('forSale', forSale);
      commit('owned', owned)
      commit('samples', [...samples, makeSampleFromResult({sample})]);
    },

    async uploadUserProfile({commit, state:{avatarId, _id, accountId}}, {blob, customUserName}) {
      const fd = new FormData();
      fd.append('file',blob,'fakename.png' );
      fd.append('data', JSON.stringify({ accountId, avatarId , _id, customUserName }) );

      const { data } = await securePostForm(axios, fd, {slug: `set_user_profile`});

      //TODO: refactor to "Make new"
      commit('avatarId', data.avatarId);
      commit('_id', data._id);
      commit('customUserName', customUserName)
    },

    async getUserProfile({ state }) {
      const {data} = await securePostJson(axios, { accountId: state.accountId }, { slug: 'get_user_profile' });

      const forSale = (data.forSale || []).map(sample => sample.sampleId);
      const owned = (data.owned || []).map(sample => sample.sampleId);
      const samples = (data.samples || []).map(sample => makeSampleFromResult({sample}));

      return {
        ...data,
        samples,
        forSale,
        owned
      };
    },

    async initialize(context) {
      const { state:{_id}, commit, dispatch } = context;
      try {
        const {publicStorageToken, apiToken} = await initializeAuth();

        if(publicStorageToken) {
          commit('authenticated', true);
          commit('accountId', apiToken.account.homeAccountId);
          commit('assignObject', {
            key: 'publicStorageToken',
            value: publicStorageToken
          });
          commit('assignObject', {
            key: 'storageToken',
            value: publicStorageToken
          });
          commit('assignObject', {
            key:'apiToken',
            value: apiToken
          });

          if(!_id) {
            //TODO: refactor to its own method
            const result = await dispatch('getUserProfile');
            const { avatarId, _id, customUserName, samples, forSale, owned} = result;

            commit('avatarId', avatarId);
            commit('customUserName', customUserName);
            commit('_id', _id);
            commit('forSale', forSale);
            commit('owned', owned)
            commit('samples', samples);
          }
        }

        return _id != "";
      } catch (e) {
        console.error('Login failed', e);
      }
      return false;
    },

    async login({ dispatch }) {
      const result = await logon();
      await dispatch('initialize');
      return result;
    },

    async logout({commit }) {
      try{
        logOff();
        commit('authenticated', false);
        //TODO: Clear cache

        return true;
      } catch(e){
        console.error(e);
        throw e;
      }
    },
  },

  getters: {
    idToken:({apiToken:{idToken = ''}}) => idToken,
    accessToken:({apiToken:{accessToken = ''}}) => accessToken,
    storageToken: ({storageToken:{accessToken = ''}}) => accessToken,
    accountId:({apiToken:{ account:{homeAccountId = ''}}}) => homeAccountId,
    userName: ({apiToken:{account:{name = ''}}}) => name,
    profileImg: ({avatarId}) => `${config.VUE_APP_AVATAR_URI}${avatarId}.png`,
    getForSale: ({samples, forSale}) => samples.filter(({_id}) => forSale.includes(_id)),
    getOwned: ({samples, owned}) => samples.filter(({_id}) => owned.includes(_id)),
  },

  mutations: {
    authenticated(state, authenticated) {
      state.authenticated = authenticated;
    },
  
    accountId(state, accountId) {
      state.accountId = accountId;
    },
  
    avatarId(state, avatarId) {
      state.avatarId = avatarId;
      localStorage.setItem('avatarId', avatarId || '');
    },

    samples(state, samples){
      state.samples = samples;
      localStorage.user_samples = JSON.stringify(samples);
    },

    addSampleForSale(state, newSample) {
      state.samples.push(newSample);
      state.forSale.push(newSample._id);

      localStorage.forSale = JSON.stringify(state.forSale);
      localStorage.user_samples = JSON.stringify([...state.samples, newSample]);
    },

    owned(state, owned){
      state.owned = owned;
      localStorage.owned = JSON.stringify(owned);
    },

    forSale(state, forSale){
      state.forSale = forSale;
      localStorage.forSale = JSON.stringify(forSale);
    },
  
    _id(state, _id) {
      state._id = _id;
      localStorage.setItem('_id', _id || '');
    },

    customUserName(state, customUserName){
      state.customUserName = customUserName;
      localStorage.setItem('customUserName', customUserName || '');
    }
  }
};