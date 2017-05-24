<template>
  <div class="container">

    <div v-show="player" ref="player" class="aplayer"></div>

    <br>

    <div class="tile is-ancestor" style="height:500px">
      <div class="tile is-child is-3 box" style="overflow:auto">
        <artist-list :list="artists_list" ref="artist_list" @select="selectArtist"></artist-list>
      </div>
      <div class="tile id-child is-9 box" style="overflow:auto">
        <album-list :list="album_list" ref="album_list" @select="selectAlbum"></album-list>
      </div>
    </div>
    <div class="tile box">
      <song-list :list="songs_list" @add="addSong" @play="addAndPlay"></song-list>
    </div>

    <div v-show="load_songs" style="width:50px;margin:0 auto">
      <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      <span class="sr-only">Cargando canciones...</span>
    </div>

  </div>
</template>

<script>
import ArtistList from '@/components/player/ArtistList';
import AlbumList from '@/components/player/AlbumList';
import SongList from '@/components/player/SongList';
import { Player } from '../../Player';
import * as MusicService from '../../providers/music.service';
import * as utils from '../../utils';
import * as _ from 'lodash';
import { socket } from '../../socket';

export default {
  name: 'PlayerContainer',

  data () {
    return {
      artists_list: [],
      albums_all: [],
      album_list: [],
      songs_list: [],
      playlist: [],
      player: null,
      bottom: false,
      load_songs: false,
      song_limit: 25
    }
  },

  created: function() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible();
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

  mounted: function() {
    this.player = new Player();
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
        console.log(this.song_list_count , this.song_limit);
        if (this.song_list_count >= this.song_limit) {
          let song_query = `limit=${this.song_limit}&offset=${this.song_list_count + this.song_limit}`;
          if (this.$refs.artist_list.selected) song_query += `&artistId=${this.$refs.artist_list.selected}`;
          if (this.$refs.album_list.selected) song_query += `&albumId=${this.$refs.album_list.selected}`;
          this.load_songs = true;
          MusicService.getSongs(song_query)
                      .then(data => {
                        console.log(song_query, this.song_list_count, data);
                        if (data.length) this.songs_list = _.concat(this.songs_list, data);
                        this.load_songs = false;
                      });
        }
      }
    },

    nextSong: function() {
      this.player.playNext();
    },

    addSong: function(song) {
      this.player = new Player(this.$refs.player, song);
    },

    addAndPlay(song) {
      this.player = new Player(this.$refs.player, song);
      this.player.playLast();
    },

    bottomVisible () {
      const visibleHeight = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const scrolled = window.scrollY
      const reachedBottom = visibleHeight + scrolled >= pageHeight
      return reachedBottom || pageHeight < visibleHeight
    }
  },

  components: {
    ArtistList,
    AlbumList,
    SongList
  }
}
</script>

<style>
  #div-artists, #div-albums {
    height: 300px;
    overflow: auto;
  }
</style>
