import * as msal from '@azure/msal-browser';

// Todo: code should come from configuration layer
const msalConfig = {
  auth: {
      clientId: "20a08db6-2b1a-4e7d-87c1-fcd9e6e8de70",
      authority: "https://login.microsoftonline.com/2d1e671b-65ba-40be-b119-5cb56ca78e80/",
      redirectUri: "http://localhost:8080/#/console/"
  },
  cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
  }
  ,system: {
      loggerOptions: {
          loggerCallback: (level, message, containsPii) => {
              if (containsPii) {	
                  return;	
              }
              switch (level) {	
                  case msal.LogLevel.Error:	
                      console.error(message);	
                      return;	
                  case msal.LogLevel.Info:	
                      console.info(message);	
                      return;	
                  case msal.LogLevel.Verbose:	
                      console.debug(message);	
                      return;	
                  case msal.LogLevel.Warning:	
                      console.warn(message);	
                      return;	
                  case msal.LogLevel.Trace:
                      console.log(message);
                      return;
              }
          },
          logLevel: msal.LogLevel.Trace
      },
      allowNativeBroker: true
  }
};

const myMSALObj = new msal.PublicClientApplication(msalConfig);

export default {
  namespaced: true,
  state: () => ({
    authenticated: true,
    username: ''
  }),
  actions:{
    initialize({commit}) {
      myMSALObj.initialize().then(() => {
        myMSALObj
          .handleRedirectPromise()
          .then(resp => handleResponse(resp, commit)).catch(err => {
            console.error(err);
        });
      });
    },

    async login() {

      const loginRequest = {
        scopes: ["User.Read"]
      };
      myMSALObj.loginPopup(loginRequest);
    },
  },
  mutations:{
    authenticated(state, authenticated){
      state.authenticated = authenticated;
    }
  }
};



function handleResponse(resp, commit) {
  console.log('Handling MSAL response', resp);
  let accountId = "";

    if (resp !== null) {
        accountId = resp.account.homeAccountId;
        myMSALObj.setActiveAccount(resp.account);
        commit('authenticated', true);
    } else {
        // need to call getAccount here?
        const currentAccounts = myMSALObj.getAllAccounts();
        if (!currentAccounts || currentAccounts.length < 1) {
            return;
        } else if (currentAccounts.length > 1) {
            // Add choose account code here
        } else if (currentAccounts.length === 1) {
            const activeAccount = currentAccounts[0];
            myMSALObj.setActiveAccount(activeAccount);
            accountId = activeAccount.homeAccountId;
            console.log(activeAccount, accountId);
            commit('authenticated', true);

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
