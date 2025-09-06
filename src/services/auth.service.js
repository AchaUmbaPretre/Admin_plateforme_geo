import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN

export const loginUser = async (user) => {
  return axios.post(`${DOMAIN}/api/auth/login`, user);
};

export const registerUser = async (user) => {
  return axios.post(`${DOMAIN}/api/auth/register`, user);
};

export const logout = async (user) => {
    return axios.post(`${DOMAIN}/api/auth/logout`, user);
  };
