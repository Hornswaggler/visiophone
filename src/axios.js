import * as _axios from 'axios';
import {config} from '@/config.js';

//TODO: get token directly from store instead of passing it all over the place...
import store from '@/store';

const MIME_TYPES = {
  MULTI_PART_FORM_DATA: 'multipart/form-data',
  APPLICATION_JSON: 'application/json'
}

export const axios = new (() => ({
  ..._axios.create({
    baseURL: `${process.env.VUE_APP_API_BASE_URL}`,
    headers: {"Access-Control-Allow-Origin": '*'}
  })
}));

export const axiosInit = async () => {
  return axios.interceptors.request.use((config) => ({
    ...config, 
    ...{
      headers: {
        ...config.headers, 
      }
    }
  }));
};

const RESPONSE_TYPES = {
  BLOB: 'blob',
  JSON: 'json',
  DEFAULT: 'json'
};

const getIdToken = store => store.getters['user/idToken'];
const accessToken = store => store.getters['user/accessToken'];
const storageToken = store => store.getters['user/storageToken'];

export const secureGet = (_axios, {responseType = RESPONSE_TYPES.DEFAULT,slug = '', uri = '' }) => _axios.get(
  uri ? uri : `${config.VUE_APP_API_BASE_URL}${slug}`, 
  {
    responseType,
    headers: {
      ..._axios.defaults.headers,
      "Access-Control-Allow-Origin": '*',
      Authorization: `Bearer ${storageToken(store)}`,
      "x-ms-version": '2021-06-08',
      'x-ms-date': (new Date()).toGMTString(),
      Accept: '*/*',
    }
  }
);

export const axiosPost = (_axios, contentType, body, {slug}) => 
_axios.post(slug, body, {
  headers: {
    // ..._axios.defaults.headers,
    // "Content-Type": contentType,
    // Authorization: `Bearer ${config.VUE_APP_CASH_APP_API_DEV}`
    ..._axios.defaults.headers,
    "Square-Version": '2022-09-21',
    "Content-Type": 'application/json',
    Authorization: `Bearer Bearer EAAAENmSme0cLWFx-_a_JPQTzYnlhb_MQIts9iWiFq6PZ1PRIYwkyBA7ngDmnd0h`
  },
  body: { 
    "amount_money": {
      "amount": 100,
      "currency": "USD"
    },
    "idempotency_key": "e872996c-89e0-4450-bfae-b4796d4249e3",
    "source_id": "cnon:card-nonce-ok"
}
});

export const securePost = (_axios, contentType, body, {slug}) => 
  _axios.post(slug, body, {
    headers: {
      ..._axios.defaults.headers,
      "Content-Type": contentType,
      Authorization: `Bearer ${getIdToken(store)}`
    }
  });

export const secureGetJson = (_axios, {slug = '', uri = ''}) => secureGet(_axios, {responseType: RESPONSE_TYPES.JSON, slug, uri});
export const secureGetBlob = (_axios, {slug = '', uri = ''}) => secureGet(_axios, {responseType: RESPONSE_TYPES.BLOB, slug, uri, token: accessToken(store)});
export const securePostForm = (_axios, body, {slug}) => securePost(_axios, MIME_TYPES.MULTI_PART_FORM_DATA, body, {slug});
export const securePostJson = (_axios, body, {slug}) => securePost(_axios, MIME_TYPES.APPLICATION_JSON, body, {slug});

export default {
  axios,
  axiosInit,
  secureGet,
  securePost,
  secureGetBlob,
  secureGetJson,
  securePostForm,
  securePostJson
};