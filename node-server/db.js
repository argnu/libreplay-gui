const mpd = require('mpd');
const utils = require('./utils');


function getArtistAlbums (client, artist) {
  return new Promise(function(resolve, reject) {
    client.sendCommand(mpd.cmd("list", ['album', 'artist', artist]), function(err, msg) {
      if (err) throw reject(err);
      albums = [];
      utils.formatList(msg).forEach(a => {
        albums.push({ name: a.Album, artist });
      });
      resolve(albums);
    });
  });
}

module.exports.getArtists = function(client) {
  return new Promise(function(resolve, reject) {
    client.sendCommand(mpd.cmd("list", ['artist']), function(err, msg) {
      if (err) throw reject(err);
      let artists = [];
      let albums_proms = [];

      utils.formatList(msg).forEach(a => {
        artists.push({ name: a.Artist, albums: []});
        albums_proms.push(getArtistAlbums(client, a.Artist));
      });

      Promise.all(albums_proms)
             .then(rs => {
               rs.forEach((r, i) => { artists[i].albums = r; });
               resolve(artists);
             });
    });
  });
}

module.exports.getSongs = function(client, query) {
  let offset = query.offset ? +query.offset : 0;
  let limit = +query.limit ? +query.limit : 25;
  return new Promise(function(resolve, reject) {
    client.sendCommand(mpd.cmd("find", [query.type, query.elem ? query.elem : '', 'window', `${offset}:${offset+limit}`]), function(err, msg) {
      if (err) throw reject(err);
      let songs = utils.formatListMulti(msg, 'file');
      if (songs.length == 0 || !songs[0]) songs = [];
      resolve(songs);
    });
  });
}
