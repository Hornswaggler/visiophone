import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_URL}`,
  timeout: 1000,
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
});

export default instance;