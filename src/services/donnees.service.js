import axios from 'axios';
import config from './../config';

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

export const getDonnees = async () => {
    return axios.get(`${DOMAIN}/api/donnees`);
  };

export const getDonneesCount = async () => {
    return axios.get(`${DOMAIN}/api/donnees/count`);
  };

export const getDonneesOne = async (id) => {
    return axios.get(`${DOMAIN}/api/donnees/one?id=${id}`);
  };

export const postDonnees = async (payload) => {
  let formData;

  if (payload instanceof FormData) {
    // si c'est déjà un FormData, on l'utilise tel quel
    formData = payload;
  } else {
    // sinon on convertit l'objet en FormData
    formData = new FormData();
    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key]);
    });
  }

  return axios.post(`${DOMAIN}/api/donnees`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

