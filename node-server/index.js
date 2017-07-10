const path = require('path');
const express = require('express');
const mpd = require('mpd');
const db = require('./db');
const utils = require('./utils');
const rtypes = require('./rtypes');
const body_parser = require('body-parser');

const app = express();
const server = require('http').Server(app);
server.listen(3000);

let io = require('socket.io')(server);
let client = mpd.connect({
  port: 6600,
  host: 'localhost',
});

app.use(body_parser.json());
app.use('/', express.static(path.join(__dirname, '..', 'dist')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD");
  next();
});

io.on('connection', function (socket) {
  client.on('ready', function() {
    socket.emit('ready');
  });

  client.on('system', function(name) {
    // console.log("update", name);
  });

  client.on('system-player', function() {
    socket.emit('update-player');
  });

  client.on('system-playlist', function() {
    socket.emit('update-playlist');
  });

  client.on('system-mixer', function() {
    socket.emit('update-player');
  });
});

app.post('/command', function(req, res) {
  let params = req.body.params ? req.body.params : [];
  client.sendCommand(mpd.cmd(req.body.command, params), function(err, msg) {
    if (err) {
      console.log(err);
      rtypes.internal_error(res);
    }
    rtypes.ok(res);
  });
});

app.get('/status', function(req, res) {
  client.sendCommand(mpd.cmd('status', []), function(err, msg) {
    if (err) console.log('status error:', err);
    rtypes.ok(res, utils.formatListMulti(msg, 'volume')[0]);
  });
});

app.get('/playlist', function(req, res) {
  client.sendCommand(mpd.cmd('playlistinfo', []), function(err, msg) {
    if (err) console.log('playlist error:', err);
    let playlist = utils.formatListMulti(msg, 'file');
    if (playlist.length == 0 || !playlist[0]) playlist = [];
    rtypes.ok(res, playlist);
  });
});

app.post('/playlist/add', function(req, res) {
  client.sendCommand(mpd.cmd('addid', [req.body.uri]), function(err, msg) {
    if (err) console.log(err);
    let result = utils.formatList(msg)[0];
    rtypes.ok(res, result);
  });
});

app.get('/database/artists', function(req, res) {
  db.getArtists(client)
    .then(r => rtypes.ok(res, r))
    .catch(e => {
      console.log(e);
      rtypes.internal_error(res)
    });
});

app.get('/database/songs', function(req, res) {
  db.getSongs(client, req.query)
    .then(r => rtypes.ok(res, r))
    .catch(e => {
      console.log(e);
      rtypes.internal_error(res)
    });
});
