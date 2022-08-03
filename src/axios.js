import * as _axios from 'axios';
import {config} from '@/config.js';
import store from '@/store';

export const axios = new (() => ({
  ..._axios.create({
    baseURL: `${process.env.VUE_APP_API_BASE_URL}`,
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
  }));
};

export const secureGet = (_axios, {slug}) => _axios.get(`${config.VUE_APP_API_BASE_URL}${slug}`);

export const securePost = async (_axios, body, {slug}) => {
  try{
    const result = await _axios.post(slug, body, {
      headers: {
        ..._axios.defaults.headers,
        "Content-Type": 'multipart/form-data'
      }
    });

    console.log('Post Result', result);

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