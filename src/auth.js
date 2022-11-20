import * as _msal from '@azure/msal-browser';
import config from '/src/config.js';
import store from '/src/store/';

const API_SCOPES = ["openid", "https://visiophone.wtf/0134f7f5-3b4a-4e3f-b8f7-992875ad538f/Sample.Search"];


const loginRequest = {
  scopes: ["openid", "https://visiophone.wtf/0134f7f5-3b4a-4e3f-b8f7-992875ad538f/Sample.Search"],
};

const _tokenRequest = {
  scopes: ["https://visiophone.wtf/0134f7f5-3b4a-4e3f-b8f7-992875ad538f/Sample.Search"],  // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
  forceRefresh: true // Set this to "true" to skip a cached token and go to the server to get a new token
};




export const b2cPolicies = {
  names: {
      signUpSignIn: "B2C_1_SIGN_UP_AND_SIGN_IN",
  },
  authorities: {
      signUpSignIn: {
          authority: "https://visiophoneb2c.b2clogin.com/visiophone.wtf/B2C_1_SIGN_UP_AND_SIGN_IN",
      },
  },
  authorityDomain: "visiophoneb2c.b2clogin.com"
}

const msalConfig = {
  auth: {
    clientId: '0134f7f5-3b4a-4e3f-b8f7-992875ad538f',
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: 'https://visiophone.wtf/'
    // identityMetadata: config.VITE_IDENTITY_METADATA,
    // authority: config.VITE_AUTH_AUTHORITY,
  //config.VITE_API_REDIRECT_URI,
    // identityMetadata: config.VITE_IDENTITY_METADATA,
    // issuer: config.VITE_IDENTITY_ISSUER
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case _msal.LogLevel.Error:
            console.error(message);
            return;
          case _msal.LogLevel.Info:
            console.info(message);
            return;
          case _msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case _msal.LogLevel.Warning:
            console.warn(message);
            return;
        }
      }
    },
  }
};

async function handleResponse(response) {

  /**
   * To see the full list of response object properties, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
   */

  if (response !== null) {
    console.log('Response', response);
    // setAccount(response.account);
    // store.dispatch('user/handleUserLogon', {

    //get an access token...
    const tokenRequest = {..._tokenRequest};
    tokenRequest['account'] = client.getAccountByHomeId(response.account.homeAccountId);
    const tokenResponse = await client.acquireTokenSilent(tokenRequest);
    console.log('Token:', tokenResponse);
    store.dispatch('user/handleUserLogon', {token: tokenResponse.accessToken})

    // });
  } else {
      selectAccount();
  }
}

export const client = new _msal.PublicClientApplication(msalConfig);
// client.loginRedirect();

// _msal.getAuth

console.log('Client:', client);


client.handleRedirectPromise()
  .then(response => {
      console.log('Handling Redirect Promise', response);
      if (response) {
          /**
           * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
           * from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy policies may use "acr" instead of "tfp").
           * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
           */
          if (response.idTokenClaims['tfp'].toUpperCase() === b2cPolicies.names.signUpSignIn.toUpperCase()) {
              handleResponse(response);
          }
      }
  })
  .catch(error => {
      console.log(error);
  });


client.loginRedirect(loginRequest);





// "https://visiophone.wtf/0134f7f5-3b4a-4e3f-b8f7-992875ad538f/Sample.Search"

export const logon = async () => {
  // const loginRequest = {
  //   scopes: ["openid", "https://visiophone.wtf/0134f7f5-3b4a-4e3f-b8f7-992875ad538f/Sample.Search"],
  // };

  console.log('Login Redirect...');

  const result = await client.acquireTokenByCode();

  // const result = await client.loginRedirect(loginRequest);

  // const accessToken = await client.handleRedirectPromise
  // const result = await client.acquireTokenSilent(loginRequest);

  // console.log('Cheese', client.getAllAccounts());


  // const account = await client.handleRedirectPromise();

  // const result = await client.acquireTokenSilent(loginRequest);

  console.log('Returned:',  result);

  return result;
  // return await client.acquireTokenPopup(loginRequest);
};

export const logOff = async (accountId) => {
  return await client.logoutPopup({
    account: client.getAccountByHomeId(accountId)
  });
};

const getAccountFromCache = (currentAccounts) => {
  if (!currentAccounts || currentAccounts.length < 1) {
      return;
  } else if (currentAccounts.length > 1) {
      // TODO Add choose account code here
  } else if (currentAccounts.length === 1) {
      return currentAccounts[0];
  }
};

export const initializeAuth = async () => {
  await client.initialize();




  console.log('Initialize auth' );

  const accounts = client.getAllAccounts();

  console.log('Initialize auth', accounts);




  // let activeAccount = await client.handleRedirectPromise();
  // if(!activeAccount) {
  //   activeAccount = getAccountFromCache(client.getAllAccounts());
  // }

  // if(activeAccount) {
  //   client.setActiveAccount(activeAccount);
    
  //   const apiToken = await client.acquireTokenSilent({ 
  //     account: activeAccount.idToken || '',
  //     scopes: API_SCOPES
  //   });

  //   //TODO: is this even needed anymore???
  //   // const publicStorageToken = await client.acquireTokenSilent({
  //   //   account: client.idToken,
  //   //   scopes: [config.VITE_READ_BLOB_SCOPE]
  //   // });
  //   return {
  //     apiToken,
  //     // publicStorageToken,
  //     client
  //   };
  // }

  return {
    apiToken:'',
    // publicStorageToken: '',
    client: {}
  };
};
