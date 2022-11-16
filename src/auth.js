import * as _msal from '@azure/msal-browser';
import config from '@/config.js';

const API_SCOPES = ["User.Read","openid", "profile"];

const msalConfig = {
  auth: {
    clientId: config.VITE_AUTH_CLIENT_ID,
    authority: config.VITE_AUTH_AUTHORITY,
    redirectUri: config.VITE_API_REDIRECT_URI,
    identityMetadata: config.VITE_IDENTITY_METADATA,
    issuer: config.VITE_IDENTITY_ISSUER
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

export const client = new _msal.PublicClientApplication(msalConfig);

export const logon = async () => {
  const loginRequest = {
    scopes: ["User.Read"],
  };
  return await client.acquireTokenPopup(loginRequest);
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



  let activeAccount = await client.handleRedirectPromise();
  if(!activeAccount) {
    activeAccount = getAccountFromCache(client.getAllAccounts());
  }

  if(activeAccount) {
    client.setActiveAccount(activeAccount);
    
    const apiToken = await client.acquireTokenSilent({ 
      account: activeAccount.idToken || '',
      scopes: API_SCOPES
    });

    //TODO: is this even needed anymore???
    // const publicStorageToken = await client.acquireTokenSilent({
    //   account: client.idToken,
    //   scopes: [config.VITE_READ_BLOB_SCOPE]
    // });
    return {
      apiToken,
      // publicStorageToken,
      client
    };
  }

  return {
    apiToken:'',
    // publicStorageToken: '',
    client: {}
  };
};
