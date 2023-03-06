const properties = [
  'VITE_API_BASE_URL',
  'VITE_API_DEBOUNCE',
  'VITE_CLIP_URI',
  'VITE_AVATAR_URI',
  'VITE_COVER_ART_URI',
  'VITE_AUTH_SIGN_UP_SIGN_IN_AUTHORITY',
  'VITE_AUTH_SIGN_UP_SIGN_IN_AUTHORITY_DOMAIN',
  'VITE_AUTH_SCOPE_SAMPLE_SEARCH',
  'VITE_AUTH_SCOPE_OPENID',
  'VITE_AUTH_API_CLIENT_ID',
  'VITE_AUTH_SIGN_UP_SIGN_IN_IDENTITY_METADATA_URL',
  'VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_NAME',
  'VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_KEY',
  'VITE_AUTH_SIGN_UP_SIGN_IN_REDIRECT_URI',
  'VITE_APP_TITLE',
  'VITE_VALIDATION_DEFINITION_URI',
  'VITE_BASE_URL',
  'VITE_CART_MODAL_TIMEOUT'
];

const env = import.meta.env;

const config = properties.reduce((acc, prop) => {
  acc[prop] = env[prop];
  return acc;
},{});

export const AUDIO_MIME_TYPE = 'audio/*';
export const IMAGE_MIME_TYPE = 'image/*';

export const PERSISTENT_MUTATIONS = [
  `user/customUserName`,
  'user/samples',
  'user/avatarId',
  'user/forSale',
  'user/stripeId',
  'user/id',
  'sample/samples'
]

export const STRIPE_ACCOUNT_STATUS = {
  "NO_ACCOUNT": "NO_ACCOUNT" ,
  "PENDING": "PENDING",
  "APPROVED": "APPROVED"
};

export default {
  ...config,
  AUDIO_MIME_TYPE,
  IMAGE_MIME_TYPE,
  PERSISTENT_MUTATIONS,
  STRIPE_ACCOUNT_STATUS,
};

