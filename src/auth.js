import * as _msal from '@azure/msal-browser';
import { loginRequest, tokenRequest as _tokenRequest, msalConfig } from '/src/b2cPolicies';
import store from '/src/store/';
import config from '/src/config';

export const client = new _msal.PublicClientApplication(msalConfig);

export const getAccessToken = async (homeAccountId = '') => {
  const tokenRequest = { ..._tokenRequest };
  tokenRequest['account'] = client.getAccountByHomeId(homeAccountId);
  return await client.acquireTokenSilent(tokenRequest);
};

const handleResponse = async (response) => {
  if (response !== null) {
    const accessToken = await getAccessToken(response.account.homeAccountId);
    store.dispatch('user/handleUserLogon', accessToken);
  } else {
    selectAccount();
  }
};

client.handleRedirectPromise()
  .then(response => {
    if (response) {
      if (response.idTokenClaims[config.VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_KEY].toUpperCase() === config.VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_NAME.toUpperCase()) {
        handleResponse(response);
      }
    }
  })
  .catch(error => {
    //Consume
  });

export const logon = async () => {
  const accounts = client.getAllAccounts();
  if (accounts.length > 0) {
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

export default {
  getAccessToken,
  logon,
  logOff
};
