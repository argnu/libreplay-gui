//jshint esversion:6

import * as axios from 'axios';

let music_data;

function prepareData(data) {
  data.forEach(a => {
    a.albums.forEach(alb => {
      alb.artistName = a.name;
      alb.songs.forEach(s => {
        s.artistName = a.name;
        s.albumName = alb.name;
      });
    });
  });
}

function handleError(error) {
  console.error(error);
  return error;
}

export class MusicService {

  constructor() {
    if (!music_data) {
      return axios.get('http://localhost:3000/rest/artists', {responseType: 'json'})
        .then( response => {
            this.music_data = response.data;
            prepareData(this.music_data);
            music_data = this.music_data;
            return music_data;
          })
        .catch(e => handleError(e));
    }
    else {
      this.music_data = music_data;
      return Promise.resolve(music_data);
    }
  }
}
