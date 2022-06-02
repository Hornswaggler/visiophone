import * as _axios from 'axios';
import {config} from '@/config.js';
import store from '@/store';

export const axios = new (() => ({
  ..._axios.create({
    baseURL: `${process.env.VUE_APP_API_BASE_URL}`,
    timeout: 20000,
    headers: {"Access-Control-Allow-Origin": 'https://visiophone.wtf'}
  })
}));

export const axiosInit = async () => {
  return axios.interceptors.request.use((config) => ({
    ...config, 
    ...{
      headers: {
        ...config.headers, 
        Authorization: `Bearer ${store.getters['user/idToken']}`
      }
    }
  }) );
};

export const secureGet = async (_axios, {slug}) => {
  const result = await _axios.get(`${config.VUE_APP_API_BASE_URL}${slug}`);
  return result;
};

export const securePost = async (_axios, body, {slug}) => {
  console.log('Sending Secure Post');
  const result = await _axios.post(`${slug}`, body, {headers: {
    ..._axios.defaults.headers,
    "Content-Type": 'multipart/form-data'
  }});
  return result;
};

export default {
  axios,
  axiosInit,
  secureGet,
  securePost
};