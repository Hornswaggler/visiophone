import * as _msal from '@azure/msal-browser';
import { config } from '@/config.js';

const API_SCOPES = ["User.Read","openid", "profile"];

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
      logLevel: _msal.LogLevel.Trace
    },
    allowNativeBroker: true,
    allowRedirectInIframe: true
  }
};


const getAccountFromCache = (currentAccounts) => {
  if (!currentAccounts || currentAccounts.length < 1) {
      return;
  } else if (currentAccounts.length > 1) {
      // TODO Add choose account code here
  } else if (currentAccounts.length === 1) {
      return currentAccounts[0];
  }
}

export const msal = new _msal.PublicClientApplication(msalConfig);

console.log(msal);

export const initializeAuth = async () => {
  await msal.initialize();
  let activeAccount = await msal.handleRedirectPromise();

  console.log('Response:', activeAccount);
  if(!activeAccount){
    activeAccount = getAccountFromCache(msal.getAllAccounts());
  }

  // const activeAccount = getAccountForResponse(response || {account: ''}, msal.getAllAccounts());
  if(activeAccount) msal.setActiveAccount(activeAccount);

  // handleMsalResponse();
  console.log('TOKEN:', activeAccount, msal);

  const apiTokenRequest = { account: msal.idToken, scopes: API_SCOPES };

  console.log('Getting a token', apiTokenRequest);


  let apiToken = '';
  try {
    apiToken = await msal.acquireTokenSilent(apiTokenRequest);
  } catch(e) {
    console.error(e);
  }

  const publicStorageTokenRequest =  {
    account: msal.idToken,
    scopes: [config.VUE_APP_READ_BLOB_SCOPE]
  };
  let publicStorageToken = '';
  try{
    publicStorageToken = await msal.acquireTokenSilent(publicStorageTokenRequest);
  } catch(e) {
    console.error(e);
  }

  return {
    apiToken,
    publicStorageToken
  }

};

