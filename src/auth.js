import * as _msal from '@azure/msal-browser'; // is tree shaking going to keep the whole msal object from being imported into this module?
import { loginRequest, tokenRequest as _tokenRequest, msalConfig } from '/src/b2cPolicies';
import store from '/src/store/';
import config from '/src/config';

export const client = new _msal.PublicClientApplication(msalConfig);

export const getAccessToken = async (homeAccountId = '') => {
  const tokenRequest = {..._tokenRequest};
  tokenRequest['account'] = client.getAccountByHomeId(homeAccountId);
  return await client.acquireTokenSilent(tokenRequest);
};

const handleResponse = async (response) => {
  console.log('auth.handleResponse.response::: ', response)
  if (response !== null) {
    store.dispatch('user/handleUserLogon', await getAccessToken(response.account.homeAccountId))
  } else {
      selectAccount();  // 
  }
}

client.handleRedirectPromise()
  .then(response => {
    console.log('auth.handleRedirectPromise::: ', response)
      if (response) {
          if (response.idTokenClaims[config.VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_KEY].toUpperCase() === config.VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_NAME.toUpperCase()) {
              handleResponse(response);
          }
      }
      console.log('fish')
  })
  .catch(error => {
      //Consume
  });

export const logon = async () => {
  const accounts = client.getAllAccounts();

  console.log('accounts::: ', accounts)

  if(accounts.length > 0) {
    //TODO: Fix this, check the policies on the accounts / match the one this app is looking for
    return accounts[0];
  }

  return await client.loginRedirect(loginRequest);
};

export const logOff = async (accountId) => {
  return await client.logoutRedirect({
    account: client.getAccountByHomeId(accountId)
  });
};

export default { // in a React app, I'm pretty sure this would error out
                  // also, we're exporting these variables multiple times
  getAccessToken,
  logon,
  logOff
}


