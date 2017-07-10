<template>
<div>
  <div ref="player" style="max-height:300px;border: 0.5px solid grey;">
    <div class="columns" style="width:100%">
      <div class="column is-11">
        <div class="button-bar">
          <i title="Mostrar/Ocultar" class="fa fa-list" @click="show = !show"></i>
          <i title="Play/Pause" :class="{ 'fa-pause': status.state == 'play', 'fa-play': status.state == 'stop' || status.state == 'pause' }" class="fa" @click="togglePause()"></i>
          <i title="Stop" class="fa fa-stop" @click="stop()"></i>
          <i title="Anterior" class="fa fa-step-backward" @click="playPrev"></i>
          <i title="Siguiente" class="fa fa-step-forward" @click="playNext"></i>
          <i title="Aleatorio" :class="{ 'btn-off': status.random == '0' }" class="fa fa-random" @click="toggleRandom()"></i>
          <i title="Repetir" :class="{ 'btn-off': status.repeat == '0' }" class="fa fa-repeat" @click="toggleRepeat()"></i>
          <i title="Limpiar Lista" :class="{ 'btn-off': playlist.length < 1 }" class="fa fa-remove" @click="clear()"></i>
        </div>
        <!-- <br> -->
        <input v-model="time" @change="chgTime" type="range" style="width:100%">
      </div>
      <div class="column is-1">
        <input v-model="volume" @change="chgVolume" type="range" style="width:0px;height:70px" orient="vertical">
      </div>
    </div>

    <div style="max-height:200px;overflow:auto;cursor:pointer;">
      <table v-show="show" class="table table-striped">
        <tbody>
          <tr v-for="(song, i) in playlist" :class="{'is-selected': status.song == i}">
            <td><i title="Por seguridad actualice primero la lista" class="fa fa-trash" @click="removeSong(i)"></i></td>
            <td @click="playSong(song)">
              {{ song.Title }}
              <span style="font-size:60%">
                  <br>
                  {{ song.Artist }}
                  <br>
                  {{ song.Album }}
                </span>
            </td>
            <td>{{ song.duration | minutes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import * as axios from 'axios';
import {
  socket
} from '../../socket';

export default {
  name: 'Player',

  data() {
    return {
      status: {},
      playlist: [],
      show: true,
      time: 0,
      time_interval: null,
      volume: 100
    }
  },

  created: function() {
    socket.on('update-player', () => {
      this.updateStatus();
    });
    socket.on('update-playlist', () => {
      this.updatePlaylist();
    });

    this.refresh();
  },

  filters: {
    minutes: function(s) {
      let number = parseFloat(s);
      var minutes = Math.floor(number / 60);
      var seconds = Math.floor(number % 60);
      return `${minutes}:${seconds.toString().length == 1 ? '0' + seconds : seconds}`;
    }
  },

  methods: {
    chgVolume: function() {
      axios.post('http://localhost:3000/command', {
        command: 'setvol',
        params: [this.volume]
      })
      .then(r => console.log(r))
      .catch(e => console.log(e))
    },

    chgTime: function() {
      axios.post('http://localhost:3000/command', {
        command: 'seekcur',
        params: [this.status.duration * this.time / 100]
      })
    },

    initTime: function() {
      this.time_interval = setInterval(() => {
        this.time = this.time + 1;
      }, (this.status.duration * 10));
    },

    updateStatus: function() {
      axios.get('http://localhost:3000/status')
        .then(r => {
          clearInterval(this.time_interval);
          this.status = r.data;
          this.volume = this.status.volume;
          this.time = this.status.elapsed * 100 / this.status.duration;
          if (this.status.state == 'play') this.initTime();
          else if (this.status.state == 'stop') this.time = 0;
        });
    },

    updatePlaylist: function() {
      axios.get('http://localhost:3000/playlist')
        .then(r => this.playlist = r.data);
    },

    refresh: function() {
      this.updateStatus();
      this.updatePlaylist();
    },

    playNext: function() {
      axios.post('http://localhost:3000/command', {
          command: 'next'
        })
        .then(r => {
          this.refresh();
        })
    },

    playPrev: function() {
      axios.post('http://localhost:3000/command', {
          command: 'previous'
        })
        .then(r => {
          this.refresh();
        })
    },

    togglePause: function() {
      let command = 'pause';
      if (this.status.state == 'stop') command = 'play';
      axios.post('http://localhost:3000/command', {
          command: command
        })
        .then(r => {
          this.refresh();
        });
    },

    stop: function() {
      axios.post('http://localhost:3000/command', {
          command: 'stop'
        })
        .then(r => {
          this.refresh();
        });
    },

    toggleRepeat: function() {
      let repeat_state = this.status.repeat == '1' ? 0 : 1;
      axios.post('http://localhost:3000/command', {
          command: 'repeat',
          params: [repeat_state]
        })
        .then(r => {
          this.refresh();
        })
    },

    toggleRandom: function() {
      let random_state = this.status.random == '1' ? 0 : 1;
      axios.post('http://localhost:3000/command', {
          command: 'random',
          params: [random_state]
        })
        .then(r => {
          this.refresh();
        })
    },

    clear: function() {
      axios.post('http://localhost:3000/command', {
          command: 'clear'
        })
        .then(r => {
          this.refresh();
        });
    },

    removeSong: function(i) {
      axios.post('http://localhost:3000/command', {
          command: 'delete',
          params: [i]
        })
        .then(r => {
          this.refresh();
        })
    },

    addSong: function(song) {
      axios.post('http://localhost:3000/command', {
          command: 'add',
          params: [song.file]
        })
        .then(r => {
          this.refresh();
        })
        .catch(e => console.error(e));
    },

    addAndPlay(song) {
      axios.post('http://localhost:3000/playlist/add', {
          uri: song.file
        })
        .then(r => {
          return axios.post('http://localhost:3000/command', {
            command: 'playid',
            params: [r.data.Id]
          })
        })
        .then(r => this.refresh())
        .catch(e => console.error(e));
    },

    playSong(song) {
      return axios.post('http://localhost:3000/command', {
          command: 'playid',
          params: [song.Id]
        })
        .then(r => {
          this.refresh();
        })
    }
  }
}
</script>

<style>
.btn-off {
  opacity: 0.5;
}

.button-bar {
  padding: 10px 10px 10px 0;
}

.button-bar i {
  padding: 0 10px 0 10px;
}
</style>
