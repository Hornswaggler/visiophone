import * as _msal from '@azure/msal-browser';
import config from '/src/config.js';

const {
  VITE_AUTH_SIGN_UP_SIGN_IN_AUTHORITY,
  VITE_AUTH_SIGN_UP_SIGN_IN_AUTHORITY_DOMAIN,
  VITE_AUTH_SCOPE_SAMPLE_SEARCH,
  VITE_AUTH_SCOPE_OPENID,
  VITE_AUTH_API_CLIENT_ID,
  VITE_AUTH_SIGN_UP_SIGN_IN_IDENTITY_METADATA_URL,
  VITE_AUTH_SIGN_UP_SIGN_IN_REDIRECT_URI
} = config;

export const loginRequest = {
  scopes: [VITE_AUTH_SCOPE_OPENID, VITE_AUTH_SCOPE_SAMPLE_SEARCH],
};

export const tokenRequest = {
  scopes: [VITE_AUTH_SCOPE_OPENID, VITE_AUTH_SCOPE_SAMPLE_SEARCH],
  forceRefresh: true // Set this to "true" to skip a cached token and go to the server to get a new token
};

//TODO: Fix this
export const msalConfig = {
  auth: {
    clientId: VITE_AUTH_API_CLIENT_ID,
    identityMetadata:VITE_AUTH_SIGN_UP_SIGN_IN_IDENTITY_METADATA_URL,
    authority: VITE_AUTH_SIGN_UP_SIGN_IN_AUTHORITY,
    knownAuthorities: [VITE_AUTH_SIGN_UP_SIGN_IN_AUTHORITY_DOMAIN],
    
    redirectUri: VITE_AUTH_SIGN_UP_SIGN_IN_REDIRECT_URI
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