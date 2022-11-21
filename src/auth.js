import * as _msal from '@azure/msal-browser';
import { loginRequest, tokenRequest as _tokenRequest, msalConfig } from '/src/b2cPolicies';
import store from '/src/store/';
import config from '/src/config';

async function handleResponse(response) {
  if (response !== null) {
    const tokenRequest = {..._tokenRequest};
    tokenRequest['account'] = client.getAccountByHomeId(response.account.homeAccountId);
    const tokenResponse = await client.acquireTokenSilent(tokenRequest);
    store.dispatch('user/handleUserLogon', {token: tokenResponse.idToken})
  } else {
      selectAccount();
  }
}

export const client = new _msal.PublicClientApplication(msalConfig);

client.handleRedirectPromise()
  .then(response => {
      if (response) {
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
      console.log(error);
  });


client.loginRedirect(loginRequest);

export const logon = async () => {
  const result = await client.acquireTokenByCode();
  return result;
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
  const accounts = client.getAllAccounts();

  return {
    apiToken:'',
    client: {}
  };
};
