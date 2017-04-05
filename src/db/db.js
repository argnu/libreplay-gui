//jshint esversion:6

import Dexie from 'dexie';

var db = new Dexie("MusicDatabase");

export function startDB() {

  db.version(1).stores({
    artists: "id,name"
  });

  return db;
}

export function addArtist( artist) {
  db.artists.add({id:artist.id, name: artist.name}).then(e =>
    console.log(e)
  ).catch(function (e) {
      alert ("Error: " + (e.stack || e));
  });
}
