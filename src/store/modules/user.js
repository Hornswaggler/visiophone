import Vue from 'vue';
import {securePostForm, securePostJson, secureGet, securePost, axios } from '/src/axios.js';
import config from '/src/config.js';
import auth from '/src/auth';
import {slugs} from '/src/slugs';

const {STRIPE_ACCOUNT_STATUS, AUDIO_MIME_TYPE} = config;

//TODO: Localstorage access should be in persistence layer!
export const makeNewUser = () => ({
  _id: localStorage._id || null,
  authenticated: false,
  idToken: '',
  avatarId: localStorage.avatarId || '',
  profileImg: '',
  customUserName: '',
  isStripeApproved: false,
  stripeId: '',
  uploads: [],
  purchases: []
});

export default {
  namespaced: true,
  state: () => makeNewUser(),
  actions: {
    async logon({dispatch}) {
      const {homeAccountId} = await auth.logon();
      await dispatch(
        'handleUserLogon',
        await auth.getAccessToken(homeAccountId)
      );
    },

    refreshProfileImg({state:{avatarId}, commit}){
      commit(
        'profileImg',
        `${config.VITE_AVATAR_URI}${avatarId}.png`
      );
    },

    async uploadUserProfile({commit}, {blob}) {
      const fd = new FormData();
      fd.append('file',blob,'fakename.png');
      const { data } = await securePostForm(axios, fd, {slug: slugs.UserProfileSet});
      commit('_id', data._id);
    },

    async getStripeProfile({ state, commit }) {
      const {data:{isStripeApproved, stripeId, uploads}} = await securePostJson(
        axios, 
        {}, 
        { slug: slugs.StripeProfileGet }
      );

      commit('uploads', uploads);
      commit('isStripeApproved', isStripeApproved);
      commit('stripeId', stripeId);

      return isStripeApproved;
    },

    async getPurchases({commit}) {
      const {data} = await secureGet(axios, {slug: slugs.PurchaseGet});
      commit('purchases', data);
    },

    async getPurchasedSample(context, {sample}){

      const {_id} = sample;      
      const {data:uri} = await securePost(axios, 'text/plain', JSON.stringify(`${_id}.wav`), {slug: slugs.GetPurchasedSample});
      const {data} = await secureGet(axios, { responseType: 'blob', uri, auth: false });

      const blob = new Blob([await data.arrayBuffer()], { type: data.type });
      const url = URL.createObjectURL(blob);

      var a = document.createElement("a");
      a.href = url;
      a.download = `${_id}.wav`;
      document.body.appendChild(a);
      a.click();
    },

    async handleUserLogon({commit, dispatch, getters:{stripeAccountStatus}}, tokenResponse){
      commit('idToken', tokenResponse.idToken);
      commit('customUserName', tokenResponse.account.name);
      commit('avatarId', tokenResponse.idTokenClaims.oid);
      commit('authenticated', true);

      await dispatch('refreshProfileImg');
      const result = await dispatch('getStripeProfile');

      //TODO: Don't retrieve these until user navigates to page...
      await dispatch('getPurchases');
      await dispatch('nav/initialize', result ? 'APPROVED' : 'NO_ACCOUNT', {root:true})
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

    uploads(state, uploads){
      Vue.set(state, 'uploads', uploads);
    },

    purchases(state, purchases) {
      Vue.set(state, 'purchases'  , purchases);
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

    idToken(state, idToken){
      Vue.set(state, 'idToken', idToken);
    }
  }
};