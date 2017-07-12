<template>
  <div>
    <div class="modal" :class="{ 'is-active': modal_download }">
      <a v-show="false" ref="download_elem" download="cancion"></a>
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Descargar Canción</p>
          <button class="delete" @click="modal_download = false"></button>
        </header>
        <section class="modal-card-body" v-if="song_todownload">
          <div v-if="!song_todownload.license">
            No existe información sobre la licencia de esta canción.
            Descargue bajo su propia responsabilidad
          </div>
          <br>
          <div style="margin:0 auto;width:100px">
            <button type="button" class="button" @click="download_file">Descargar</button>
          </div>
        </section>
      </div>
    </div>


    <p class="control has-icons-right" style="margin-bottom:10px">
      <input class="input" type="text" placeholder="Buscar cancioń..." @keyup="filter" v-model="search_song">
      <span class="icon is-small is-right">
        <i class="fa fa-search"></i>
      </span>
    </p>

    <table class="table is-striped">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th>Track</th>
          <th class="is-hidden-desktop">Info</th>
          <th class="is-hidden-mobile">Name</th>
          <th class="is-hidden-mobile">Artist</th>
          <th class="is-hidden-mobile">Album</th>
          <th class="is-hidden-mobile">Duration</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><i @click="addAndPlayAll()" class="fa fa-play"></i></td>
          <td><i @click="addAll()" class="fa fa-plus"></i></td>
          <td></td>
          <td class="is-hidden-desktop"></td>
          <td class="is-hidden-mobile"></td>
          <td class="is-hidden-mobile"></td>
          <td class="is-hidden-mobile"></td>
          <td class="is-hidden-mobile"></td>
          <td></td>
        </tr>
        <tr @click="select(song)" type="button" v-for="song in list_show">
          <td><i @click="addAndPlay(song)" class="fa fa-play"></i></td>
          <td><i @click="add(song)" class="fa fa-plus"></i></td>
          <td>{{ song.track }}</td>
          <td class="is-hidden-desktop">
            {{ song.name }} <br>
            <span class="artist-name">Artist: {{ song.artist.name}} </span><br>
            <span class="album-name">Album: {{ song.name }} </span>
          </td>
          <td class="is-hidden-mobile">{{ song.name }}</td>
          <td class="is-hidden-mobile">{{ song.artist.name}}</td>
          <td class="is-hidden-mobile">{{ song.album.name }}</td>
          <td class="is-hidden-mobile">{{ song.duration | minutes }}</td>
          <td><i @click="downloadModal(song)" class="fa fa-download"></i></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as axios from 'axios';
import { Config } from '../../configs/Config';

export default {
  name: 'SongList',
  props: ['list'],
  data () {
    return {
      search_song: '',
      list_show: [],
      debounced: null,
      modal_download: false,
      song_todownload: null
    }
  },

  filters: {
    minutes: function(secs) {
      if (secs) {
        let minutes = Math.round(secs / 60);
        let seconds = (secs % 60).toString();
        return `${minutes}:${seconds.length == 1 ? '0' + seconds : seconds}`;
      }
      else return '';
    }
  },

  watch: {
      list: function() {
        this.list_show = this.list;
      }
  },

  methods: {
    select: function(song) {
      this.$emit('select', song);
    },

    addAndPlay: function(song) {
      this.$emit('play', song);
    },

    add: function(song) {
      this.$emit('add', song);
    },

    addAndPlayAll: function() {
      this.$emit('playAll', this.list_show);
    },

    addAll: function() {
      this.$emit('addAll', this.list_show);
    },

    filter: function() {
      _.debounce(this.filterSong, 500, { 'maxWait': 1000 })();
    },

    filterSong: function() {
      this.$emit('search', this.search_song);
    },

    downloadModal(song) {
      this.song_todownload = song;
      this.modal_download = true;
    },

    download_file() {
      this.$refs.download_elem.href =  `${Config.host}/files/songs/${this.song_todownload.id}/download`;
      this.$refs.download_elem.download = `${this.song_todownload.name}.mp3`
      this.$refs.download_elem.click();
      this.modal_download = false;
    }
  }
}
</script>

<style>
i {
  cursor: pointer;
}

.artist-name, .album-name {
  font-size: 60%
}
</style>
