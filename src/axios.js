import * as _axios from 'axios';
import {config} from '@/config.js';

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

export const secureGet = (_axios, {responseType = RESPONSE_TYPES.DEFAULT,slug = '', uri = '', token = ''}) => {
  const endpoint = uri ? uri : `${config.VUE_APP_API_BASE_URL}${slug}`;
  return _axios.get(endpoint, {
    responseType,
    headers: {
      ..._axios.defaults.headers,
      "Access-Control-Allow-Origin": '*',
      Authorization: `Bearer ${token}`,
      "x-ms-version": '2021-06-08',
      'x-ms-date': (new Date()).toGMTString(),
      Accept: '*/*',
    }
  });
};

export const secureGetJson = (_axios, {slug = '', uri = '', token = ''}) =>
  secureGet(_axios, {responseType: RESPONSE_TYPES.JSON, slug, uri, token});

export const secureGetBlob = (_axios, {slug = '', uri = '', token = ''}) => 
  secureGet(_axios, {responseType: RESPONSE_TYPES.BLOB, slug, uri, token});

export const securePost = (_axios, contentType, body, {slug, token}) => {
  return _axios.post(slug, body, {
    headers: {
      ..._axios.defaults.headers,
      "Content-Type": contentType,
      Authorization: `Bearer ${token}`
    }
  })
};

export const securePostForm = (_axios, body, {slug, token}) => 
  securePost(_axios, MIME_TYPES.MULTI_PART_FORM_DATA, body, {slug, token});

export const securePostJson = (_axios, body, {slug, token}) => {
  return securePost(_axios, MIME_TYPES.APPLICATION_JSON, body, {slug, token});
};

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