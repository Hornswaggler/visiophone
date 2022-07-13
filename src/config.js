const properties = [
  'VUE_APP_BASE_URL',
  'VUE_APP_READ_SCOPE',
  'VUE_APP_API_BASE_URL',
  'VUE_APP_AUTH_CLIENT_ID',
  'VUE_APP_AUTH_AUTHORITY',
  'VUE_APP_API_REDIRECT_URI',
  'VUE_APP_API_UPLOAD_SAMPLE_URI',
  'VUE_APP_API_SAMPLE_URI'
];

const env = process.env;

export const config = properties.reduce((acc, prop) => {
  acc[prop] = env[prop];
  return acc;
},{})

export default {
  config
};