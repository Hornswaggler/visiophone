import {securePostForm, securePostJson, axios } from '@/axios.js';
import * as msal from '@azure/msal-browser';
import {config} from '@/config.js';
import {makeSampleFromResult} from './sample';
// import { initializeAuth, msal } from '@/auth';

//TODO Move to configuration
const API_SCOPES = ["User.Read","openid", "profile"];

export const makeNewUser = () => ({
  _id: localStorage._id || '',
  authenticated: false,
  msal: {
    account:{ homeAccountId: '' }
  },
  publicStorageToken: '',

  avatarId: localStorage.avatarId || '',
  customUserName: localStorage.customUserName || '',
  samples: JSON.parse(localStorage.user_samples || "[]"),
  forSale: JSON.parse(localStorage.forSale || "[]"),
  owned: JSON.parse(localStorage.owned || "[]")
});

const msalConfig = {
  auth: {
    clientId: config.VUE_APP_AUTH_CLIENT_ID,
    authority: config.VUE_APP_AUTH_AUTHORITY,
    redirectUri: config.VUE_APP_API_REDIRECT_URI,
    identityMetadata: config.VUE_APP_IDENTITY_METADATA,
    issuer: config.VUE_APP_IDENTITY_ISSUER
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
  ,system: {
    loggerOptions: {
      logLevel: msal.LogLevel.Trace
    },
    allowNativeBroker: true,
    allowRedirectInIframe: true
  }
};

const myMSALObj = new msal.PublicClientApplication(msalConfig);

export default {
  namespaced: true,
  state: () => makeNewUser(),
  actions:{

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

    async purchaseSample({ commit, state:{samples}, getters:{accountId} }, {sample}) {
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

    async uploadUserProfile({commit, state:{avatarId, _id}, getters:{accountId}}, {blob, customUserName}) {
      const fd = new FormData();
      fd.append('file',blob,'fakename.png' );
      fd.append('data', JSON.stringify({ accountId, avatarId , _id, customUserName }) );

      const { data } = await securePostForm(axios, fd, {slug: `set_user_profile`});

      //TODO: refactor to "Make new"
      commit('avatarId', data.avatarId);
      commit('_id', data._id);
      commit('customUserName', customUserName)
    },

    async getUserProfile({ state:{ accountId } }) {
      const {data} = await securePostJson(axios, { accountId }, { slug: 'get_user_profile' });

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
      const { getters:{idToken}, state:{_id}, commit, dispatch } = context;
      try {

        console.log('About to initialize auth layer');
        // const {apiToken, publicStorageToken} = await initializeAuth();

        await myMSALObj.initialize();
        const resp = await myMSALObj.handleRedirectPromise();
        handleResponse(resp, commit);

        const apiTokenRequest = { account: idToken, scopes: API_SCOPES };
        const msal = await myMSALObj.acquireTokenSilent(apiTokenRequest);

        const publicStorageTokenRequest =  {
          account: myMSALObj.idToken,
          scopes: [config.VUE_APP_READ_BLOB_SCOPE]
        };

        const {publicStorageToken} = await myMSALObj.acquireTokenSilent(publicStorageTokenRequest);

        commit('assignObject', {
          key: 'publicStorageToken',
          value: publicStorageToken
        });

        commit('assignObject', {
          key:'apiToken',
          value: msal.accessToken
        });

        // console.log('ASSIGNING API TOKEN', apiToken);
        
        // if(apiToken){
        //   commit('assignObject',{
        //     key: 'msal',
        //     value: msal
        //   });
        // }
       
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

        return true;
      } catch (e) {
        console.error('Login failed', e);
      }
      return false;
    },

    async login({commit, dispatch}) {
      const loginRequest = {
        scopes: ["User.Read","openid", "profile"],
      };

      const result = await myMSALObj.acquireTokenPopup(loginRequest);
      commit('assignObject', {
        key: 'msal',
        value: result 
      });

      await dispatch('initialize');

      return result;
    },

    async logout({ getters:{accountId}, commit }) {
      try{
        commit('authenticated', false);
        await myMSALObj.logoutPopup({
          account: myMSALObj.getAccountByHomeId(accountId)

          //TODO: Clear cache 
        });
        return true;
      } catch(e){
        console.error(e);
        throw e;
      }
    },

    logoutRedirect(){
      myMSALObj.logoutRedirect({
        onRedirectNavigate: () => {
          return false;
        }
      })
    }
  },

  // TODO Fix this...
  getters: {
    // accountId:(state) => {
    //   console.log('MSAL:', state.msal.account);
    //   return state.msal.account
    // },
    accessToken:({msal:{accessToken = ''}}) => accessToken,
    userName: ({msal:{account:{name}}}) => name,
    idToken: ({msal:{idToken}} = {msal:{idToken:''}}) => idToken,
    profileImg: ({avatarId}) => `${config.VUE_APP_AVATAR_URI}${avatarId}.png`,
    getForSale: ({samples, forSale}) => {
      const filtered = samples.filter(({_id}) => forSale.includes(_id));
      return filtered;
    },
    getOwned: ({samples, owned}) => {
      const filtered = samples.filter(({_id}) => owned.includes(_id));
      return filtered;
    }
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

function handleResponse(resp, commit) {
  let accountId = "";
  if (resp !== null) {
    accountId = resp.account.homeAccountId;
    myMSALObj.setActiveAccount(resp.account);
    commit('authenticated', true);
    commit('accountId', resp.account.homeAccountId);
  } else {
    const currentAccounts = myMSALObj.getAllAccounts();
    if (!currentAccounts || currentAccounts.length < 1) {
        return;
    } else if (currentAccounts.length > 1) {
        // TODO Add choose account code here
    } else if (currentAccounts.length === 1) {
        const activeAccount = currentAccounts[0];
        myMSALObj.setActiveAccount(activeAccount);
        accountId = activeAccount.homeAccountId;
        commit('authenticated', true);
        commit('accountId', activeAccount.homeAccountId);
    }
  }
}