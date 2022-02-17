import axios from 'axios';

const instance = axios.create({
  timeout: 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'x-functions-key': '0MFH2JPg1Jc5x7PG241/2kBad95b6uDaMFv64NMbU97QsFa29zFz/Q=='
  }
});

export default instance;