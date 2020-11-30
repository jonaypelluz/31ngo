import axios from 'axios';

const _axios = axios.create({
  baseURL: 'https://ngo-fcd6e.firebaseio.com'
});

_axios.interceptors.request.use(
  async config => {
    config.params = config.params || {};
    config.params['auth'] = sessionStorage.getItem('userToken');
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default _axios;
