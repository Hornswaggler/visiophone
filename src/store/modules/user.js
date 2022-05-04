import axios from '@/axios.js';
import msal from '@azure/msal-browser';

export default {
  namespaced: true,
  state: () => ({
    authenticated: false,
    username: ''
  }),
  actions:{
    async login({commit}, {username, password}) {
      const {data} = await axios.request({
        method: 'post',
        url: "api/login",
        timeout: 10000,
        data: {username, password}
      });

      if(data) commit('authenticated', data);
      
      console.log('API returned  ', data);
      return data;
    },
  },
  mutations:{
    authenticated(state, authenticated){
      state.authenticated = authenticated;
    }
  }
};






const msalConfig = {
  auth: {
      clientId: "20a08db6-2b1a-4e7d-87c1-fcd9e6e8de70",
      authority: "https://login.windows-ppe.net/common/"
  },
  cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
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




// let signInType;
let accountId = "";

// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);
myMSALObj.initialize().then(() => {
    // Redirect: once login is successful and redirects with tokens, call Graph API
    myMSALObj.handleRedirectPromise().then(handleResponse).catch(err => {
        console.error(err);
    });
});


function handleResponse(resp) {
    if (resp !== null) {
        accountId = resp.account.homeAccountId;
        myMSALObj.setActiveAccount(resp.account);
        // showWelcomeMessage(resp.account);
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
            // showWelcomeMessage(activeAccount);
        }
    }
}

async function signIn(signInType) {
    if (signInType === "popup") {
        return myMSALObj.loginPopup(loginRequest).then(handleResponse).catch(function (error) {
            console.log({...error});
            console.log(error);
        });
    } else if (signInType === "redirect") {
        return myMSALObj.loginRedirect(loginRequest)
    }
}

function signOut(interactionType) {
    const logoutRequest = {
        account: myMSALObj.getAccountByHomeId(accountId)
    };

    if (interactionType === "popup") {
        myMSALObj.logoutPopup(logoutRequest).then(() => {
            window.location.reload();
        });
    } else {
        myMSALObj.logoutRedirect(logoutRequest);
    }
}

async function getTokenPopup(request, account) {
    const startTime = Date.now();
    return await myMSALObj.acquireTokenSilent(request).then((response) => {
        console.log(`Token acquisition time elapsed: ${Date.now() - startTime}ms`);
        console.log(response);
        return response;
    }).catch(async (error) => {
        console.log("silent token acquisition fails.");
        if (error instanceof msal.InteractionRequiredAuthError) {
            console.log("acquiring token using popup");
            return myMSALObj.acquireTokenPopup(request).catch(error => {
                console.error(error);
            });
        } else {
            console.error(error);
        }
    });
}
