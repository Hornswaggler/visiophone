import * as _msal from '@azure/msal-browser';
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
  if (response !== null) {
    store.dispatch('user/handleUserLogon', await getAccessToken(response.account.homeAccountId))
  } else {
      selectAccount();
  }
}

client.handleRedirectPromise()
  .then(response => {
      if (response) {
          // authorized = true;
          /**
           * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
           * from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy policies may use "acr" instead of "tfp").
           * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
           */
          if (response.idTokenClaims['tfp'].toUpperCase() === config.VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_NAME.toUpperCase()) {
              handleResponse(response);
          }
      }
  })
  .catch(error => {
      //Consume
  });

export const logon = async () => {
  const accounts = client.getAllAccounts();

  if(accounts.length > 0) {
    //TODO: Fix this, check the policies on the accounts / match the one this app is looking for
    return accounts[0];
  }

  return client.loginRedirect(loginRequest);
};

export const logOff = async (accountId) => {
  return await client.logoutPopup({
    account: client.getAccountByHomeId(accountId)
  });
};

export default {
  getAccessToken,
  logon,
  logOff
}


