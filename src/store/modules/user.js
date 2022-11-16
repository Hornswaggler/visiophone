import Vue from 'vue';
import {securePostForm, securePostJson, axios } from '@/axios.js';
import config from '@/config.js';
import {makeSampleFromResult} from './sample';
import { initializeAuth, logon, logOff, client } from '@/auth';

//TODO: Localstorage access should be in persistence layer!
export const makeNewUser = () => ({
  _id: localStorage._id || null,
  authenticated: false,
  publicStorageToken: '',
  apiToken:{},
  avatarId: localStorage.avatarId || '',
  customUserName: '',
  samples: [],
  forSale: [],
  owned: [],
  isAuthorizedSeller: false,
  stripeId: ''
});

export default {
  namespaced: true,
  state: () => makeNewUser(),
  actions: {
    //TODO This is no longer used...
    initFromStorage( context, mutation, callback) {
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
      commit('customUserName', customUserName);
    },

    async upgradeToSellerAccount({commit}) {
      const result  = await securePostJson(axios, {}, { slug: config.VITE_API_PROVISION_STRIPE_STANDARD });
      const {data:{url, id:stripeId}} = result;

      
      commit('stripeId', stripeId);
      window.location.href = url;
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
        const {apiToken} = await initializeAuth();


        if(apiToken) {
          commit('authenticated', true);
          commit('accountId', apiToken.account.localAccountId);
          // commit('publicStorageToken', publicStorageToken);
          commit('apiToken', apiToken);

          if(!_id) {
            //TODO: refactor to its own method
            const { avatarId, _id, customUserName, samples, forSale, owned} = await dispatch('getUserProfile');

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
    publicStorageToken: ({publicStorageToken:{accessToken = ''}}) => accessToken,
    accountId:({apiToken:{ account:{localAccountId = ''}}}) => localAccountId,
    userName: ({apiToken:{account:{name = ''}}}) => name,
    profileImg: ({avatarId}) => new URL(`${config.VITE_AVATAR_URI}${avatarId}.png`, import.meta.url).href,
    getForSale: ({samples, forSale}) => samples.filter(({_id}) => forSale.includes(_id)),
    getOwned: ({samples, owned}) => samples.filter(({_id}) => owned.includes(_id)),
  },

  mutations: {
    authenticated(state, authenticated) {
      state.authenticated = authenticated;
    },

    stripeId(state, stripeId){
      state.stripeId = stripeId
    },

    accountId(state, accountId) {
      state.accountId = accountId;
    },
    
    avatarId(state, avatarId) {
      state.avatarId = avatarId;
    },

    samples(state, samples){
      state.samples = samples;
    },

    addSampleForSale(state, newSample) {
      state.samples.push(newSample);
      state.forSale.push(newSample._id);

      localStorage.forSale = JSON.stringify(state.forSale);
    },

    owned(state, owned){
      state.owned = owned;
    },

    forSale(state, forSale){
      state.forSale = forSale;
    },

    _id(state, _id) {
      state._id = _id;
    },

    customUserName(state, customUserName){
      state.customUserName = customUserName;
    },

    publicStorageToken(state, publicStorageToken){
      Vue.set(state, 'publicStorageToken', publicStorageToken);
    },

    apiToken(state, apiToken){
      Vue.set(state, 'apiToken', apiToken);
    }
  }
};