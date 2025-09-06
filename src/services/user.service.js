import axios from 'axios';
import config from './../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getUsers = async () => {
    return axios.get(`${DOMAIN}/api/user`);
  };