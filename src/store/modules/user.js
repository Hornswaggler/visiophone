import Vue from 'vue';
import {securePostForm, securePostJson, secureGet, securePost, axios } from '/src/axios.js';
import {makeSamplePackFromResult} from '@/models/samplePackFactory';
import config from '/src/config.js';
import auth from '/src/auth';
import {slugs} from '/src/slugs';

const {STRIPE_ACCOUNT_STATUS, AUDIO_MIME_TYPE} = config;

//TODO: Localstorage access should be in persistence layer!
export const makeNewUser = () => ({
  id: localStorage.id || null,
  authenticated: false,
  idToken: '',
  avatarId: localStorage.avatarId || '',
  profileImg: '',
  customUserName: '',
  isStripeApproved: false,
  stripeId: '',
  isLibraryInitialized: false,
  uploads: [],
  purchases: [],
  libraryLinks: {}
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

    refreshProfileImg({state:{avatarId}, commit}) {
      commit(
        'profileImg',
        `${config.VITE_AVATAR_URI}${avatarId}.png`
      );
    },

    async uploadUserProfile({commit}, {blob}) {
      const fd = new FormData();
      fd.append('file',blob,'fakename.png');
      const { data } = await securePostForm(axios, fd, {slug: slugs.UserProfileSet});
      commit('id', data.id);
    },

    async initializeLibrary({commit, dispatch, state:{isLibraryInitialized}}){
      if(!isLibraryInitialized){
        Promise.all([
          dispatch('getUploads'),
          dispatch('getPurchases'),
          //Todo: Implement this w/ Push notification(s)
          // dispatch('getTransactions')
        ]);
      }
    },

    addLibrarySamplePackLinks({dispatch}, {samplePackId, links}) {
      for(let i = 0; i < links.length; i++) {
        const link = links[i]['link'];
        const sampleId = links[i]['id'];
        dispatch('addLibrarySampleLink', {
          samplePackId: samplePackId,
          sampleId,
          link
        });
      }
    },
    
    addLibrarySampleLink({state:{libraryLinks}, commit}, {samplePackId, sampleId, link}) {
      commit('libraryLinks', {
        ...libraryLinks,
        [samplePackId]: [
          ...(libraryLinks[samplePackId] || []),
          {sampleId, link}
        ]
      })
    },

    async getStripeProfile({ commit }) {
      const {data:{isStripeApproved, stripeId}} = await securePostJson(
        axios, 
        {}, 
        { slug: slugs.StripeProfileGet }
      );

      commit('isStripeApproved', isStripeApproved);
      commit('stripeId', stripeId);

      return isStripeApproved;
    },

    async getPurchases({commit}) {
      const {data} = await secureGet(axios, {slug: slugs.PurchaseGet});
      commit('purchases', data.map(samplePack => makeSamplePackFromResult({samplePack})));
    },

    async getUploads({commit}){
      const {data} = await securePostJson(
        axios, 
        {}, 
        { slug: slugs.StripeUploadsGet }
      );
      if(data.data != null){
        commit('uploads', data.data.map(samplePack => makeSamplePackFromResult({samplePack})));
      }
    },

    //TODO: Implmenent w/ push notification(s)
    // async getTransactions(){
    //   console.log('Getting Transactions');
    //   const result = await secureGet(
    //     axios,
    //     { slug: 'F_SamplePackTransactionStatus' }
    //   );
    // },

    async getPurchasedSamplePack({state:{libraryLinks}, dispatch}, {samplePack:{id}}){
      if(!libraryLinks[id]) {
        const { data = [] } = await securePost(
          axios,
          'text/plain',
          JSON.stringify(id),
          {slug: slugs.GetPurchasedSamplePack}
        );
        
        dispatch('addLibrarySamplePackLinks',{
          samplePackId: id,
          links: data.map(({Key, Value}) => ({id: Key, link: Value}))
        });
      }
      
      return libraryLinks[id];
    },

    async getPurchasedSample(context, { sample }){
      const { id } = sample;
      const { data: uri } = await securePost(
        axios, 
        'text/plain',
        JSON.stringify(`${id}.wav`),
        {slug: slugs.GetPurchasedSample}
      );
      
      const { data } = await secureGet(axios, { responseType: 'blob', uri, auth: false });

      return data;
    },

    async handleUserLogon({commit, dispatch}, tokenResponse){
      commit('idToken', tokenResponse.idToken);
      commit('customUserName', tokenResponse.account.name);
      commit('avatarId', tokenResponse.idTokenClaims.oid);
      commit('authenticated', true);

      await dispatch('refreshProfileImg');
      await dispatch('nav/initialize', await dispatch('getStripeProfile') ? 'APPROVED' : 'NO_ACCOUNT', {root:true});
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
    },
    uploads(){

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

    id(state, id) {
      state.id = id;
    },

    isStripeApproved(state, isStripeApproved) {
      state.isStripeApproved = isStripeApproved;
    },

    customUserName(state, customUserName){
      state.customUserName = customUserName;
    },

    idToken(state, idToken){
      Vue.set(state, 'idToken', idToken);
    },
    libraryLinks(state, libraryLinks) {
      Vue.set(state, 'libraryLinks', libraryLinks);
    }
  }
};