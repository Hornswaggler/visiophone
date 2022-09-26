import {securePostForm, securePostJson, axios } from '@/axios.js';
import * as msal from '@azure/msal-browser';
import {config} from '@/config.js';

//TODO Move to configuration
const API_SCOPES = ["User.Read","openid", "profile"];

export const makeNewUser = () => ({
  _id: localStorage._id || '',
  accountId: '',
  authenticated: false,
  userIcon: require('@/assets/Comp_boi_idle.gif'),
  shelfCapacity: 75,
  msal: {},
  apiToken: '',
  publicStorageToken: '',
  avatarId: localStorage.avatarId || '',
  customUserName: localStorage.customUserName || ''
});

const msalConfig = {
  auth: {
    clientId: config.VUE_APP_AUTH_CLIENT_ID,
    authority: config.VUE_APP_AUTH_AUTHORITY,
    redirectUri: config.VUE_APP_API_REDIRECT_URI,
    identityMetadata: 'https://login.microsoftonline.com/2d1e671b-65ba-40be-b119-5cb56ca78e80/v2.0/.well-known/openid-configuration',
    issuer: 'https://login.microsoftonline.com/2d1e671b-65ba-40be-b119-5cb56ca78e80/v2.0'
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
    async uploadUserProfile({commit, getters:{idToken: token}, state:{avatarId, accountId, _id}}, {blob, customUserName}) {
      const fd = new FormData();
      fd.append('file',blob,'fakename.png' );
      fd.append('data', JSON.stringify({ accountId, avatarId , _id, customUserName}) );

      const { data } = await securePostForm(axios, fd, {slug: `set_user_profile`, token});

      commit('avatarId', data.avatarId);
      commit('_id', data._id);
      commit('customUserName', customUserName)
    },

    async getUserProfile({ commit, getters:{idToken: token}, state:{ accountId: userId }}) {
      const {data:{avatarId, _id, customUserName}} = await securePostJson(axios, { userId }, { slug: 'get_user_profile', token });

      console.log('Get user Profile');

      commit('assignObject', {key:'_id', value: _id});
      commit('assignObject', {key:'avatarId', value: avatarId});
      commit('assignObject', {key: 'customUserName', value: customUserName })

      return {avatarId, _id, customUserName};
    },

    async initialize({getters:{idToken}, state:{avatarId, customUserName}, commit, dispatch}) {
      try {
        await myMSALObj.initialize();
        const resp = await myMSALObj.handleRedirectPromise();
        handleResponse(resp, commit);

        const apiTokenRequest = { account: idToken, scopes: API_SCOPES };
        const msal = await myMSALObj.acquireTokenSilent(apiTokenRequest);

        const publicStorageTokenRequest =  {
          account: myMSALObj.idToken,
          scopes: [config.VUE_APP_READ_BLOB_SCOPE]
        };

        const { accessToken: publicStorageToken } = await myMSALObj.acquireTokenSilent(publicStorageTokenRequest);

        commit('assignObject', {
          key: 'publicStorageToken',
          value: publicStorageToken
        });

        commit('assignObject', {
          key:'apiToken',
          value: msal.accessToken
        });

        commit('assignObject',{
          key: 'msal',
          value: msal
        });

        console.log('Probably the bug...', customUserName);

        if(!avatarId) {
          console.log('Retrieving');
          const { avatarId, _id, customUserName } = await dispatch('getUserProfile', { token: msal.accessToken });
          commit('avatarId', avatarId);
          commit('customUserName', customUserName)
          commit('_id', _id)

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

    async logout({state:{accountId}, commit}) {
      try{
        commit('authenticated', false);
        await myMSALObj.logoutPopup({
          account: myMSALObj.getAccountByHomeId(accountId)
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
    userName: ({msal:{account:{name}} = {msal:{account:{name:''}}}}) => name,
    idToken: ({msal:{idToken}} = {msal:{idToken:''}}) => idToken,
    profileImg: ({avatarId}) => `${config.VUE_APP_AVATAR_URI}${avatarId}.png`
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
