<template>
  <div>
    <div class="ui stackable menu">
      <div class="ui container">
        <div class="item">
          <player :source="getSongUrl" @next="nextSong" @previous="prevSong"></player>
        </div>
        <div class="right item">
          <div class="ui input"><input placeholder="Search..." type="text"></div>
        </div>
      </div>
    </div>

    <br><br>

      <div class="ui grid">
        <div class="row segment ui">
          <div class="four wide column" id="div-artists">
              <artist-list :list="getArtists" @select="selectArtist"></artist-list>
          </div>
          <div class="twelve wide column" id="div-albums">
              <album-list :list="getAlbums" @select="selectAlbum"></album-list>
          </div>
        </div>
        <div class="row segment ui">
          <div class="column" style="max-height: 300px;overflow: auto">
            <song-list :list="getSongs" @add="addSong" @play="addAndPlay"></song-list>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import ArtistList from '@/components/ArtistList';
import AlbumList from '@/components/AlbumList';
import SongList from '@/components/SongList';
import Player from '@/components/Player';


export default {
  name: 'Container',

  data () {
    return {
      artist_selected: null,
      album_selected: null,
      song_selected: null,
      i_song_selected: null,
      playlist: []
    }
  },

  inject: [ 'MUSIC' ],

  computed: {
    getArtists: function() {
      return this.MUSIC.artists.map(a => {
        return { name: a.name, id: a.id};
      });
    },
    getAlbums: function() {
      if (!this.artist_selected)
        return this.MUSIC.artists.map(a => a.albums).reduce((a,b) => (a.length) ? a.concat(b) : b, [])
      else
        return this.MUSIC.artists.find(a => a.id == this.artist_selected.id).albums;
    },
    getSongs: function() {
      if (!this.album_selected)
        return this.getAlbums.map(a => a.songs).reduce((a,b) => (a.length) ? a.concat(b) : b, []);
      else
        return this.getAlbums.find(a => a.id == this.album_selected.id).songs;
    },
    getSongUrl: function() {
      if (this.song_selected)
        return 'http://localhost:3000/files/songs/' + this.song_selected.id;
    }
  },

  methods: {
    selectArtist: function(artist) {
      if (artist == 'all') {
        this.artist_selected = null;
        this.album_selected = null;
      }
      else {
        this.artist_selected = artist;
        this.album_selected = null;
      }
    },
    selectAlbum: function(album) {
      this.album_selected = album;
    },
    selectSong: function(song) {
      this.song_selected = song;
    },
    nextSong: function() {
      this.i_song_selected++;
      if (this.i_song_selected == this.playlist.length) this.i_song_selected = 0;
      this.song_selected = this.playlist[this.i_song_selected];
    },
    addSong: function(song) {
      this.playlist.push(song);
      if (this.playlist.length == 1) {
        this.i_song_selected = 0;
        this.song_selected = this.playlist[this.i_song_selected];
      }
    },
    addAndPlay(song) {
      this.i_song_selected = this.playlist.length;
      this.playlist.push(song);
      this.song_selected = song;
    },
    removeFromPlaylist: function(song) {
      this.playlist = this.playlist.filter(s => s.id != song.id);
    }
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
  #div-artists, #div-albums {
    height: 300px;
    overflow: auto;
  }
</style>
