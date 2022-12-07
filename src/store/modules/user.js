import Vue from 'vue';
import {securePostForm, securePostJson, secureGet, axios } from '/src/axios.js';
import config from '/src/config.js';
import {makeSampleFromResult} from './sample';
import auth from '/src/auth';
const {STRIPE_ACCOUNT_STATUS} = config;

//TODO: Localstorage access should be in persistence layer!
export const makeNewUser = () => ({
  _id: localStorage._id || null,
  authenticated: false,




  publicStorageToken: '',
  apiToken:'',



  avatarId: localStorage.avatarId || '',




  profileImg: '',
  customUserName: '',
  samples: [],
  forSale: [],
  owned: [],


  
  isStripeApproved: false,
  stripeId: '',
  stripeUri: ''

});


export default {
  namespaced: true,
  state: () => makeNewUser(),
  actions: {
    async logon({dispatch}) {
      const {homeAccountId} = await auth.logon();
      await dispatch('handleUserLogon', await auth.getAccessToken(homeAccountId))
    },

    async getVisioTokens(){
      console.log('Getting Visiotokens');

      const result = await secureGet(axios, {slug: 'get_visio-tokens'});
    },

    refreshProfileImg({state:{avatarId}, commit}){
      commit('profileImg', `${config.VITE_AVATAR_URI}${avatarId}.png?${new Date().getTime()}`);
    },

    async purchaseSample({ commit, state:{ samples } }, {sample}) {
      const {data} = await secureGet(
        axios,
        { responseType: "text", slug: `sample_purchase` }
      );

      // JSON.stringify({samples: [
      //   {priceId: sample.priceId }
      // ]}),

      // const forSale = (data.forSale || []).map(sample => sample.sampleId);
      // const owned = (data.owned || []).map(sample => sample.sampleId);

      // commit('forSale', forSale);
      // commit('owned', owned)
      // commit('samples', [...samples, makeSampleFromResult({sample})]);

      // window.location.href = data;
    },

    async uploadUserProfile({commit, state:{avatarId, _id, accountId}}, {blob}) {
      const fd = new FormData();
      fd.append('file',blob,'fakename.png' );
      const { data } = await securePostForm(axios, fd, {slug: `set_user_profile`});
      commit('_id', data._id);
    },

    async upgradeToSellerAccount({commit}) {
      const result  = await secureGet(axios, { slug: config.VITE_API_PROVISION_STRIPE_STANDARD });
      const {data:{stripeUri, stripeId}} = result;
      
      commit('stripeId', stripeId);
      window.location.href = stripeUri;
    },

    async getUserProfile({ state, commit }) {
      const {data:{isStripeApproved, stripeId, stripeUri}} =  await securePostJson(
        axios, 
        { accountId: state.accountId }, 
        { slug: 'get_user_profile' }
      );
      commit('isStripeApproved', isStripeApproved);
      commit('stripeId', stripeId);
      commit('stripeUri', stripeUri);
    },

    async handleUserLogon({commit, dispatch},tokenResponse){
      commit('apiToken', tokenResponse.idToken);
      commit('customUserName', tokenResponse.account.name);
      commit('avatarId', tokenResponse.idTokenClaims.oid);
      commit('authenticated', true);

      await dispatch('refreshProfileImg');
      await dispatch('getUserProfile');
    },

    async handleProvisionReturn({commit, state:{stripeId}}){
      const {data:{isStripeApproved: isStripeApproved}} = await securePostJson(axios, {stripeId}, {slug: 'provision_stripe_standard_return'});
      commit('isStripeApproved', isStripeApproved);
    },

    async logout({commit }) {
      try{
        auth.logOff();
        commit('authenticated', false);
        //TODO: Clear cache

        return true;
      } catch(e) {
        console.error(e);
        throw e;
      }
    },
  },

  getters: {
    idToken:({apiToken}) => apiToken,
    accessToken:({apiToken:{accessToken = ''}}) => accessToken,
    publicStorageToken: ({publicStorageToken:{accessToken = ''}}) => accessToken,
    accountId:({apiToken:{ account:{localAccountId = ''}}}) => localAccountId,
    userName: ({apiToken:{account:{name = ''}}}) => name,
    getForSale: ({samples, forSale}) => samples.filter(({_id}) => forSale.includes(_id)),
    getOwned: ({samples, owned}) => samples.filter(({_id}) => owned.includes(_id)),
    stripeAccountStatus: ({stripeId, isStripeApproved}) => {
      if((stripeId || '').trim() === '') {
        return STRIPE_ACCOUNT_STATUS.NO_ACCOUNT;
      } else if(!isStripeApproved) {


        return STRIPE_ACCOUNT_STATUS.PENDING;
      } else if(isStripeApproved) {
        return STRIPE_ACCOUNT_STATUS.APPROVED;
      }
      return STRIPE_ACCOUNT_STATUS.NO_ACCOUNT;
    }
  },

  mutations: {
    authenticated(state, authenticated) {
      state.authenticated = authenticated;
    },

    stripeId(state, stripeId){
      state.stripeId = stripeId
    },

    stripeUri(state, stripeUri){
      state.stripeUri = stripeUri;
    },

    accountId(state, accountId) {
      state.accountId = accountId;
    },
    
    avatarId(state, avatarId) {
      state.avatarId = avatarId;
    },

    profileImg(state, profileImg){
      state.profileImg = profileImg;
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

    isStripeApproved(state, isStripeApproved) {
      state.isStripeApproved = isStripeApproved;
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