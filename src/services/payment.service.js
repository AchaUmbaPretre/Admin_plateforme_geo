import axios from 'axios';
import config from '../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getPayment = async () => {
    return axios.get(`${DOMAIN}/api/payment`);
  };

export const getPaymentCount = async () => {
    return axios.get(`${DOMAIN}/api/payment/count`);
  };


export const getPaymentStat = async () => {
    return axios.get(`${DOMAIN}/api/payment/stat`);
  };

export const postPayment = async (data) => {
  return axios.post(`${DOMAIN}/api/payment/initiate`, data);
};