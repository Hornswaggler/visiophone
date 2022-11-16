const properties = [
  'VITE_BASE_URL',
  'VITE_READ_SCOPE',
  'VITE_API_BASE_URL',
  'VITE_AUTH_CLIENT_ID',
  'VITE_AUTH_AUTHORITY',
  'VITE_API_REDIRECT_URI',
  'VITE_API_DEBOUNCE',
  'VITE_READ_BLOB_SCOPE',
  'VITE_CLIP_URI',
  'VITE_STALE_RECORD_THRESHOLD',
  'VITE_API_SAMPLE_SEARCH_URI',
  'VITE_API_SAMPLE_UPLOAD_URI',
  'VITE_AVATAR_URI',
  'VITE_COVER_ART_URI',
  'VITE_IDENTITY_METADATA',
  'VITE_IDENTITY_ISSUER',
  'VITE_API_PROVISION_STRIPE_STANDARD',
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

export default {
  ...config,
  AUDIO_MIME_TYPE,
  IMAGE_MIME_TYPE,
  PERSISTENT_MUTATIONS
};

