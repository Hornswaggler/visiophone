const properties = [
  'VUE_APP_BASE_URL',
  'VUE_APP_READ_SCOPE',
  'VUE_APP_API_BASE_URL',
  'VUE_APP_AUTH_CLIENT_ID',
  'VUE_APP_AUTH_AUTHORITY',
  'VUE_APP_API_REDIRECT_URI',
  'VUE_APP_API_DEBOUNCE',
  'VUE_APP_READ_BLOB_SCOPE',
  'VUE_APP_CLIP_URI',
  'VUE_APP_STALE_RECORD_THRESHOLD',
  'VUE_APP_API_SAMPLE_SEARCH_URI',
  'VUE_APP_API_SAMPLE_UPLOAD_URI',
  'VUE_APP_AVATAR_URI'
];

const env = process.env;

export const config = properties.reduce((acc, prop) => {
  acc[prop] = env[prop];
  return acc;
},{});

export const AUDIO_MIME_TYPE = 'audio/*';
export const IMAGE_MIME_TYPE = 'image/*';

export default {
  config: {
    ...config,
    AUDIO_MIME_TYPE,
    IMAGE_MIME_TYPE
  }
};

