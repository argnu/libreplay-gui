<template>
  <div class="container" style="margin:20px">

    <div class="modal" :class="{ 'is-active': modal_playlist }" v-if="user">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Saved Playlists</p>
          <button class="delete" @click="modal_playlist = false"></button>
        </header>
        <section class="modal-card-body">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(playlist, i) in playlists">
                <td>{{ playlist.name }}</td>
                <td style="width:40px"><i @click="playPlaylist(playlist)" class="fa fa-play"></i></td>
                <td style="width:40px"><i @click="addPlaylist(playlist)" class="fa fa-plus"></i></td>
                <td style="width:40px"><i @click="removePlaylist(i)" class="fa fa-trash"></i></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': modal_save_playlist }" v-if="user">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Save Playlist</p>
          <button class="delete" @click="modal_save_playlist = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input class="input"  type="text" placeholder="Nombre del playlist..." v-model="playlist_name">
              <span class="icon is-small is-left">
                <i class="fa fa-list"></i>
              </span>
              <!-- <span class="icon is-small is-right" v-show="submitted && !validation.email">
                <i class="fa fa-warning"></i>
              </span> -->
            </p>
          </div>
          <div class="field">
            <p class="control">
              <button @click="savePlaylist" type="button" class="button is-primary" style="width:100%;">
                <b>Save</b>
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>

    <div v-if="user" style="margin:10px 0 20px 5px">
      <button class="button" @click="getPlaylists">
        <i class="fa fa-list" style="margin-right:10px"></i> Listas de Reproducción
      </button>
    </div>

    <div class="columns is-desktop">
      <div class="colum is-3 box" id="column-artists">
        <artist-list :list="artists_list" ref="artist_list" @select="selectArtist"
                    @addArtistToPlaylist="addArtistToPlaylist" @playArtist="playArtist">
        </artist-list>
      </div>
      <div class="colum is-9 box" id="column-albums">
          <album-list :list="album_list" ref="album_list" @select="selectAlbum"
                      @addAlbumToPlaylist="addAlbumToPlaylist" @playAlbum="playAlbum">
          </album-list>
      </div>
    </div>

    <br>

    <div class="columns">
      <div class="column box">
        <song-list :list="songs_list" @add="addSongToPlaylist" @play="addAndPlay" @search="searchSongs"
                   @playAll="addAndPlayAll" @addAll=addAll>
        </song-list>
      </div>

      <div v-show="load_songs" style="width:50px;margin:0 auto">
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span class="sr-only">Cargando canciones...</span>
      </div>
    </div>

    <div id="player">
      <player ref="player" @savePlaylist="savePlaylistModal"></player>
    </div>

    <transition enter-active-class="animated rollIn"  leave-active-class="animated rollOut">
      <div id="to-top" v-show="scroll_top">
        <i class="fa fa-chevron-circle-up fa-3x" @click="scrollTop"></i>
      </div>
    </transition>

  </div>
</template>

<script>
import ArtistList from '@/components/player/ArtistList';
import AlbumList from '@/components/player/AlbumList';
import SongList from '@/components/player/SongList';
import Player from '@/components/player/Player';
import * as MusicService from '../../providers/music.service';
import * as utils from '../../utils';
import * as _ from 'lodash';
import { socket } from '../../socket';
import * as axios from 'axios';
import * as Cookies from 'js-cookie';

export default {
  name: 'PlayerContainer',

  data () {
    return {
      artists_list: [],
      albums_all: [],
      album_list: [],
      songs_list: [],
      bottom: false,
      scroll_top: false,
      load_songs: false,
      song_limit: 25,
      search_song: '',
      modal_playlist: false,
      modal_save_playlist: false,
      save_playlist_songs: [],
      playlist_name: '',
      playlists: [],
      user: null
    }
  },

  created: function() {
    this.user = Cookies.get('LibrePlayUser') ? JSON.parse(Cookies.get('LibrePlayUser')) : null;

    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible();
      this.scroll_top = window.scrollY > 0;
    });

    socket.on('new-artist', artist => {
      this.artists_list.push(artist);
      this.artists_list = _.sortBy(this.artists_list, [function(o) { return o.name; }]);
    });

    socket.on('new-album', album => {
      this.albums_all.push(album);
      this.albums_all = _.sortBy(this.albums_all, [function(o) { return o.name; }]);
      if (this.$refs.artist_list.selected == album.artistId)  {
        let album_selected = this.$refs.album_list.selected;
        this.selectArtist(album.artistId);
        this.$refs.album_list.selected = album_selected;
      }
    });

    MusicService.getArtists()
      .then(data => {
        this.artists_list = data;
        this.albums_all = data.map(a => a.albums).reduce((a,b) => a.concat(b), []);
        this.album_list = this.albums_all;
        MusicService.getSongs(`limit=${this.song_limit}`)
                    .then(data => this.songs_list = data);
        console.info('Datos de música recuperados del servidor');

      });
  },

  watch: {
    bottom: function(bottom) {
      if (bottom) this.addSongToList();
    }
  },

  computed: {
    song_list_count: function() {
      return this.songs_list.length;
    }
  },

  methods: {
    selectArtist: function(artist) {
      let song_query = `limit=${this.song_limit}`;
      this.$refs.album_list.selected = '';
      if (artist) {
        this.album_list = this.albums_all.filter(a => a.artistId === artist);
        song_query += `&artistId=${artist}`;
      }
      else this.album_list = this.albums_all;
      MusicService.getSongs(song_query).then(data => this.songs_list = data);
    },

    selectAlbum: function(album) {
      MusicService.getSongs(`albumId=${album}&limit=${this.song_limit}`)
                  .then(data => this.songs_list = data);
    },

    addSongToList: function() {
      if (this.$refs.artist_list && this.$refs.album_list) {
        if (this.song_list_count >= this.song_limit) {
          let song_query = `limit=${this.song_limit}&offset=${this.song_list_count + this.song_limit}`;
          if (this.$refs.artist_list.selected) song_query += `&artistId=${this.$refs.artist_list.selected}`;
          if (this.$refs.album_list.selected) song_query += `&albumId=${this.$refs.album_list.selected}`;
          if (this.search_song) song_query += `&search=${this.search_song}`;
          this.load_songs = true;
          MusicService.getSongs(song_query)
                      .then(data => {
                        if (data.length) this.songs_list = _.concat(this.songs_list, data);
                        this.load_songs = false;
                      });
        }
      }
    },

    searchSongs: function(value) {
      let song_query = `limit=${this.song_limit}`;
      if (this.$refs.artist_list.selected) song_query += `&artistId=${this.$refs.artist_list.selected}`;
      if (this.$refs.album_list.selected) song_query += `&albumId=${this.$refs.album_list.selected}`;
      this.search_song = value;
      song_query += `&search=${value}`;
      MusicService.getSongs(song_query)
                  .then(data => this.songs_list = data);
    },

    bottomVisible () {
      const visibleHeight = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const scrolled = window.scrollY
      const reachedBottom = visibleHeight + scrolled >= pageHeight
      return reachedBottom || pageHeight < visibleHeight
    },

    addAndPlayAll: function(songs) {
      this.$refs.player.addAndPlay(songs[0]);
      let total = songs.length;
      for(let i=1; i<total; i++) this.$refs.player.addSong(songs[i]);
    },

    addAll: function(songs) {
      songs.forEach(s => {
        this.$refs.player.addSong(s);
      });
    },

    addSongToPlaylist: function(song) {
      this.$refs.player.addSong(song);
    },

    addAndPlay: function(song) {
      this.$refs.player.addAndPlay(song);
    },

    addAlbumToPlaylist: function(album) {
      let song_query = `albumId=${album.id}`;
      MusicService.getSongs(song_query)
                  .then(data => {
                     data.forEach(s => this.addSongToPlaylist(s));
                  });
    },

    playAlbum: function(album){
      let song_query = `albumId=${album.id}`;
      MusicService.getSongs(song_query)
                  .then(data => {
                    let length = data.length;
                    this.$refs.player.reset();
                    for (let i = 0; i < length; i++) {
                      if (i === 0) this.addAndPlay(data[i]);
                      else this.addSongToPlaylist(data[i]);
                    }
                  });
    },

    addArtistToPlaylist: function(artist) {
      let song_query = `artistId=${artist.id}`;
      MusicService.getSongs(song_query)
                  .then(data => {
                     data.forEach(s => this.addSongToPlaylist(s));
                  });
    },

    playArtist: function(artist){
      let song_query = `artistId=${artist.id}`;
      MusicService.getSongs(song_query)
                  .then(data => {
                    let length = data.length;
                    this.$refs.player.reset();
                    for (let i = 0; i < length; i++) {
                      if (i === 0) this.$refs.player.addAndPlay(data[i]);
                      else this.addSongToPlaylist(data[i]);
                    }
                  });
    },

    playPlaylist: function(playlist){
      let total = playlist.listsongs.length;
      this.$refs.player.reset();
      for (let i = 0; i < total; i++) {
        if (i === 0) this.$refs.player.addAndPlay(playlist.listsongs[i].song);
        else this.addSongToPlaylist(playlist.listsongs[i].song);
      }
      this.modal_playlist = false;
    },

    addPlaylist: function(playlist){
      let total = playlist.songs.length;
      for (let i = 0; i < total; i++) {
        this.addSongToPlaylist(playlist.songs[i]);
      }
      this.modal_playlist = false;
    },

    scrollTop() {
      utils.scrollToY(0, 1000, 'easeInOutQuint');
    },

    getPlaylists: function() {
      axios.get(`http://192.168.0.8:3000/rest/users/${this.user.data.id}/playlists?access_token=${this.user.token}`)
           .then(r => {
             this.playlists = r.data.playlists
             this.modal_playlist = true;
           })
           .catch(e => console.error(e));
    },

    savePlaylistModal: function(songs) {
      this.modal_save_playlist = true;
      this.save_playlist_songs = [];
      for (let i = 0; i < songs.length; i++) {
        this.save_playlist_songs.push({
          id: songs[i].id,
          order: i
        });
      }
    },

    savePlaylist: function() {
      let playlist = {
        name: this.playlist_name,
        songs: this.save_playlist_songs
      }

      axios.put(`http://192.168.0.8:3000/rest/users/${this.user.data.id}/playlists?access_token=${this.user.token}`, playlist)
           .then(r => {
             this.modal_save_playlist = false;
             this.save_playlist_songs = [];
             this.playlist_name = '';
           })
           .catch(e => {
             if (e.response.status === 409) alert("Error: playlist ya existe!");
             else alert('Error en servidor')
           });
    },

    removePlaylist: function(i) {
      let playlist = this.playlists[i];
      axios.delete(`http://192.168.0.8:3000/rest/playlists/${playlist.id}?access_token=${this.user.token}`)
           .then(r => {
             this.playlists.splice(i, 1);
           })
           .catch(e => {
             if (e.response.status === 404) alert('No existe el playlist');
           });
    },
  },

  components: {
    ArtistList,
    AlbumList,
    SongList,
    Player
  }
}
</script>

<style>
  @import '/static/APlayer.css';

  @media (max-width: 768px) {
    #player {
      width: 95%;
    }
    #column-artist {
      max-height: 300px;
      overflow-y: auto;
    }
    #column-albums {
      max-height: 200px;
      overflow-y: auto;
    }
  }

  @media (min-width: 768px) {
    #player {
      min-width: 400px;
    }
  }

  #player {
    position: fixed;
    z-index: 999;
    left: 10px;
    bottom: 10px;
    background-color: white;
  }

  #to-top {
    position: fixed;
    z-index: 999;
    bottom: 10px;
    right: 20px;
  }
</style>
