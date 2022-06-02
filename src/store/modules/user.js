import * as msal from '@azure/msal-browser';
import {axios, secureGet} from '@/axios.js';
import {config} from '@/config.js';

console.log('LOADED CONFIG:', config, [config.VUE_APP_READ_SCOPE]);

// TODO: code should come from configuration layer
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
          // loggerCallback: (level, message, containsPii) => {
          //     if (containsPii) {
          //         return;
          //     }
          //     switch (level) {
          //         case msal.LogLevel.Error:
          //           console.error(message);
          //           return;
          //         case msal.LogLevel.Info:
          //             console.info(message);
          //             return;
          //         case msal.LogLevel.Verbose:
          //             console.debug(message);
          //             return;
          //         case msal.LogLevel.Warning:
          //             console.warn(message);
          //             return;
          //         case msal.LogLevel.Trace:
          //             console.log(message);
          //             return;
          //     }
          // },
          logLevel: msal.LogLevel.Trace
      },
      allowNativeBroker: true,
      allowRedirectInIframe: true
  }
};

console.log('MsalConfig:', msalConfig);

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
      console.log('Login', result);
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

    async callMSGraph({state:{msal, accountId}}) {


      

      console.log('Calling Graph', msal);
 
      const tokenRequest = {account: msal.idToken, scopes: [config.VUE_APP_READ_SCOPE] };

      console.log('TOKEN REQUEST:', tokenRequest);

      const resp = await myMSALObj.acquireTokenSilent(tokenRequest);

      console.log('Responded: ', resp);
      const result = await secureGet(axios, {slug: 'secure/testapi'});
      // }


      console.log('Graph Response: ', result);
    },

    logoutRedirect(){
      console.log('logout redirect');
      myMSALObj.logoutRedirect({
        onRedirectNavigate: () => {
          return false;
        }
      })
    }

  },
  getters: {
    userName: (state) => {
      console.log('Getting user Name',state.msal);
      const {msal:{account:{name = ''} = {}}} = state;
      return name;
    },
    accessToken: (state) => {
      const { msal: { accessToken = ''} } = state;
      console.log('accessToken', accessToken);
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

  console.log('Handling Response..');

  if (resp !== null) {
      accountId = resp.account.homeAccountId;
      myMSALObj.setActiveAccount(resp.account);
      console.log('AUTHENTICATED');
      commit('authenticated', true);
      commit('accountId', resp.account.homeAccountId);
      console.log('MSAL', myMSALObj);
  } else {
      // need to call getAccount here?
      const currentAccounts = myMSALObj.getAllAccounts();
      if (!currentAccounts || currentAccounts.length < 1) {
          return;
      } else if (currentAccounts.length > 1) {
          // TODO Add choose account code here
      } else if (currentAccounts.length === 1) {
          const activeAccount = currentAccounts[0];
          myMSALObj.setActiveAccount(activeAccount);
          accountId = activeAccount.homeAccountId;
          // console.log(activeAccount, accountId);
          commit('authenticated', true);
          commit('accountId', activeAccount.homeAccountId);
          console.log('MSAL', myMSALObj);
          


          // showWelcomeMessage(activeAccount);
      }
  }
}

// async function signIn(signInType) {
//     if (signInType === "popup") {
//         return myMSALObj.loginPopup(loginRequest).then(handleResponse).catch(function (error) {
//             console.log({...error});
//             console.log(error);
//         });
//     } else if (signInType === "redirect") {
//         return myMSALObj.loginRedirect(loginRequest)
//     }
// }

// function signOut(interactionType) {
//     const logoutRequest = {
//         account: myMSALObj.getAccountByHomeId(accountId)
//     };

//     if (interactionType === "popup") {
//         myMSALObj.logoutPopup(logoutRequest).then(() => {
//             window.location.reload();
//         });
//     } else {
//         myMSALObj.logoutRedirect(logoutRequest);
//     }
// }

// async function getTokenPopup(request, account) {
//     const startTime = Date.now();
//     return await myMSALObj.acquireTokenSilent(request).then((response) => {
//         console.log(`Token acquisition time elapsed: ${Date.now() - startTime}ms`);
//         console.log(response);
//         return response;
//     }).catch(async (error) => {
//         console.log("silent token acquisition fails.");
//         if (error instanceof msal.InteractionRequiredAuthError) {
//             console.log("acquiring token using popup");
//             return myMSALObj.acquireTokenPopup(request).catch(error => {
//                 console.error(error);
//             });
//         } else {
//             console.error(error);
//         }
//     });
// }
