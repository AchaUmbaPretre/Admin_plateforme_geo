import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getSubscription = async () => {
    return axios.get(`${DOMAIN}/api/subscription`);
  };
