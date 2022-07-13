import * as msal from '@azure/msal-browser';
import {config} from '@/config.js';

const msalConfig = {
  auth: {
    clientId: config.VUE_APP_AUTH_CLIENT_ID,
    authority: config.VUE_APP_AUTH_AUTHORITY,
    redirectUri: config.VUE_APP_API_REDIRECT_URI
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
  state: () => ({
    accountId: '',
    authenticated: false,
    username: '',
    userIcon: 'Comp_boi_idle.gif',
    shelfCapacity: 75,
    msal:{}
  }),
  actions:{
    async initialize({commit}) {
      await myMSALObj.initialize().then(() => {
        myMSALObj
          .handleRedirectPromise()
          .then(async resp => {
            handleResponse(resp, commit);
            const tokenRequest = {account: myMSALObj.idToken, scopes: [config.VUE_APP_READ_SCOPE] };
            const result = await myMSALObj.acquireTokenSilent(tokenRequest);
            commit('assignObject', { key: 'msal', value: result });
          })
          .catch(err => {
            //consume console.error(err);
          });
      });
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
      const logoutRequest = {
        account: myMSALObj.getAccountByHomeId(accountId)
      };
        
      try{
        await myMSALObj.logoutPopup(logoutRequest);
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
    userName: (state) => {
      const {msal:{account:{name = ''} = {}}} = state;
      return name;
    },
    accessToken: (state) => {
      const { msal: { accessToken = ''} } = state;
      return accessToken;
    },
    idToken: (state) => {
      const { msal: { idToken = ''} } = state;
      return idToken;
    }
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
