import * as msal from '@azure/msal-browser';
import {config} from '@/config.js';

//TODO Move to configuration
const API_SCOPES = ["User.Read","openid", "profile"];

export const makeNewUser = () => ({
  accountId: '',
  authenticated: false,
  userIcon: require('@/assets/Comp_boi_idle.gif'),
  shelfCapacity: 75,
  msal: {},
  apiToken: {},
  publicStorageToken: {}
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
    async initialize({getters:{idToken},commit}) {
      try {
        await myMSALObj.initialize();
        const resp = await myMSALObj.handleRedirectPromise();
        handleResponse(resp, commit);

        const apiTokenRequest = {account: idToken, scopes: API_SCOPES };        
        const apiToken = await myMSALObj.acquireTokenSilent(apiTokenRequest);

        const publicStorageTokenRequest =  {
          account: myMSALObj.idToken,
          scopes: [config.VUE_APP_READ_BLOB_SCOPE]
        };

        const {accessToken: publicStorageToken} = await myMSALObj.acquireTokenSilent(publicStorageTokenRequest);

        commit('assignObject', {
          key: 'publicStorageToken',
          value: publicStorageToken
        });

        commit('assignObject', {
          key:'apiToken',
          value: apiToken
        });

        commit('assignObject',{
          key: 'msal',
          value: apiToken
        });

        return true;
      } catch (e) {
        console.error('Login failed', e);
      }

      return false;
    },

    async login({commit}) {
      const loginRequest = {
        scopes: ["User.Read","openid", "profile"],
      };
      const result = await myMSALObj.acquireTokenPopup(loginRequest);
      commit('assignObject', { key: 'msal', value: result });
      return result;
    },

    async logout({state:{accountId}}) {
      try{
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
  getters: {
    userName: ({msal:{account:{name}} = {msal:{account:{name:''}}}}) => name,
    idToken: ({msal:{idToken}} = {msal:{idToken:''}}) => idToken,
  },
  mutations:{
    authenticated(state, authenticated){
      state.authenticated = authenticated;
    },
    accountId(state, accountId) {
      state.accountId = accountId;
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
