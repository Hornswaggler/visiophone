const properties = [
  'VITE_BASE_URL',
  'VITE_API_BASE_URL',
  'VITE_AUTH_CLIENT_ID',
  'VITE_AUTH_AUTHORITY',
  'VITE_API_DEBOUNCE',
  'VITE_READ_BLOB_SCOPE',
  'VITE_CLIP_URI',
  'VITE_STALE_RECORD_THRESHOLD',
  'VITE_API_SAMPLE_SEARCH_URI',
  'VITE_API_SAMPLE_UPLOAD_URI',
  'VITE_AVATAR_URI',
  'VITE_COVER_ART_URI',
  'VITE_IDENTITY_ISSUER',
  'VITE_AUTH_SIGN_UP_SIGN_IN_AUTHORITY',
  'VITE_AUTH_SIGN_UP_SIGN_IN_AUTHORITY_DOMAIN',
  'VITE_AUTH_SCOPE_SAMPLE_SEARCH',
  'VITE_AUTH_SCOPE_OPENID',
  'VITE_AUTH_API_CLIENT_ID',
  'VITE_AUTH_SIGN_UP_SIGN_IN_IDENTITY_METADATA_URL',
  'VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_NAME',
  'VITE_AUTH_SIGN_UP_SIGN_IN_POLICY_KEY',
  'VITE_API_SAMPLE_PURCHASE',
  'VITE_API_ACCOUNT_UPGRADE',
  'VITE_AUTH_SIGN_UP_SIGN_IN_REDIRECT_URI'
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
  'user/owned',
  'user/stripeId',
  'user/_id',
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
  STRIPE_ACCOUNT_STATUS
};

