//jshint esversion:6

import * as axios from 'axios';

function handleError(error) {
  console.error(error);
  return error;
}

export class MusicService {

  constructor() {
    this.artists = [];
  }

  init() {
    return axios.get('http://localhost:3000/rest/artists',{responseType: 'json'})
      .then( response => {
        this.artists = response.data;
      })
      .catch( error => handleError(error) );
  }

  getArtists() {
    return this.artists;
    // return this.artists.map(a => a.name);
  }

   getArtist(id) {
    return this.artists.find(a => a.id == id);
  }
}
