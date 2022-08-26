import * as _axios from 'axios';
import {config} from '@/config.js';

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

export const secureGet = (_axios, {slug = '', uri = '', token = ''}) => {
  const endpoint = uri ? uri : `${config.VUE_APP_API_BASE_URL}${slug}`;
  return _axios.get(endpoint, {
    responseType: 'blob',
    headers: {
      ..._axios.defaults.headers,
      "Access-Control-Allow-Origin": '*',
      Authorization: `Bearer ${token}`,
      "x-ms-version": '2021-06-08',
      'x-ms-date': (new Date()).toGMTString(),
      Accept: '*/*',
    }
  });
}

export const securePost = async (_axios, body, {slug, token}) => {
  try{
    const result = await _axios.post(slug, body, {
      headers: {
        ..._axios.defaults.headers,
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return result;
  }catch(e){
    console.error('Secure Post Failed: ', e);
  }
};

export default {
  axios,
  axiosInit,
  secureGet,
  securePost
};