//jshint esversion:6

import * as axios from 'axios';

export function getArtists() {
  return axios.get('http://192.168.0.8:3000/rest/artists', {responseType: 'json'})
    .then( response => {
        return Promise.resolve(response.data);
      })
    .catch(e => handleError(e));
}

export function getAlbums(q) {
  return axios.get(`http://192.168.0.8:3000/rest/albums?${q || ''}`, {responseType: 'json'})
    .then( response => {
        return Promise.resolve(response.data);
      })
    .catch(e => handleError(e));
}

export function getSongs(q) {
  return axios.get(`http://192.168.0.8:3000/rest/songs?${q || ''}`, {responseType: 'json'})
    .then( response => {
        return Promise.resolve(response.data);
      })
    .catch(e => handleError(e));
}

function handleError(error) {
  console.error(error);
  return error;
}

// export class MusicService {
//
//   constructor() {
//     if (!music_data) {
//       return axios.get('http://192.168.0.8:3000/rest/artists', {responseType: 'json'})
//         .then( response => {
//             this.music_data = response.data;
//             prepareData(this.music_data);
//             music_data = this.music_data;
//             return music_data;
//           })
//         .catch(e => handleError(e));
//     }
//     else {
//       this.music_data = music_data;
//       return Promise.resolve(music_data);
//     }
//   }
//
//   getArtists() {
//
//   }
// }
