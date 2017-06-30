//jshint esversion:6

import * as axios from 'axios';

export function getArtists() {
  return axios.get('http://localhost:3000/database/artists', {responseType: 'json'})
    .then( response => {
        return Promise.resolve(response.data);
      })
    .catch(e => handleError(e));
}
export function getSongs(q) {
  return axios.get(`http://localhost:3000/database/songs?${q || ''}`, {responseType: 'json'})
    .then( response => {
        return Promise.resolve(response.data);
      })
    .catch(e => handleError(e));
}

function handleError(error) {
  console.error(error);
  return error;
}
