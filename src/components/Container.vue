<template>
  <div>
    <div class="ui attached stackable menu">
      <div class="ui container">
        <a class="item">
          <i class="music icon"></i>
        </a>        
        <a class="item">
          LibrePlay
        </a>
        <a class="item">
          <player :source="getSongUrl"></player>
        </a>
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
            <song-list :list="getSongs" @select="selectSong"></song-list>
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
      song_selected: null
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
