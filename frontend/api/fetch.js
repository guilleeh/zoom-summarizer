import axios from 'axios';
import Router from 'next/router';

export const apiFetch = async (url, method, params, body, isAuth = false) => {
  let options = {
    withCredentials: false,
    params,
    headers: {},
  };
  if (isAuth) {
    const jwt = localStorage.getItem('jwt');
    options.headers['Authorization'] = `Bearer ${jwt}`;
  }

  if (method.toLowerCase() === 'get') {
    try {
      const response = await axios.get(url, options);

      return response.data;
    } catch (e) {
      if (e?.response?.status === 401) {
        Router.push('/sign-in');
      }
      return e.response.data;
    }
  } else if (method.toLowerCase() === 'post') {
    try {
      const response = await axios.post(url, body, options);

      return response.data;
    } catch (e) {
      if (e?.response?.status === 401) {
        Router.push('/sign-in');
      }
      return e.response.data;
    }
  } else if (method.toLowerCase() === 'put') {
    try {
      const response = await axios.put(url, body, options);

      return response.data;
    } catch (e) {
      if (e?.response?.status === 401) {
        Router.push('/sign-in');
      }
      return e.response.data;
    }
  }
};
