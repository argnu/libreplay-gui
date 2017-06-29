<template>
  <div>
    <div ref="player">
      <table class="table table-striped" style="max-height:300px;overflow-y:auto">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Canción</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>

import * as axios from 'axios';

export default {
  name: 'Player',

  data () {
    return {
      // status: 'Waiting...',
      player: null,
      status: {}
    }
  },

  created: function() {
    Promise.all([
      axios.post('http://localhost/mpd/player/playlist', {command: 'playlistinfo'}),
      axios.get('http://localhost/mpd/player/status')
    ])
    .then(rs => {
      console.log(rs[0].data.result)
      this.status = rs[1].data.result;
    })
    .catch(e => console.error(e));
  },

  methods: {
    nextSong: function() {
      this.player.playNext();
    },


    reset: function() {

    },

    addSong: function(song) {
      axios.post('http://localhost/mpd/player/add', {file: song.uri})
           .then(r => {
             this.status.playlistlength = this.status.playlistlength + 1;
           })
           .catch(e => console.error(e));
    },

    addAndPlay(song) {
      axios.post('http://localhost/mpd/player/add', {file: song.uri})
           .then(r => {
             this.status.playlistlength = +this.status.playlistlength + 1;
             axios.post('http://localhost/mpd/player/playback', {command: 'play', params: `${this.status.playlistlength - 1}`})
           })
           .catch(e => console.error(e));
    }
  }
}
</script>

<style>
</style>
