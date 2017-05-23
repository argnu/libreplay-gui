<template>
  <div class="container">

    <div v-show="player" ref="player" class="aplayer"></div>

    <br>

    <div class="tile is-ancestor">
      <div class="tile is-child is-3 box">
        <artist-list :list="getArtists" @select="selectArtist"></artist-list>
      </div>
      <div class="tile id-child is-9 box">
        <album-list :list="getAlbums" ref="album_list"></album-list>
      </div>
    </div>
    <div class="tile box">
      <song-list :list="getSongs" @add="addSong" @play="addAndPlay"></song-list>
    </div>

  </div>
</template>

<script>
import ArtistList from '@/components/player/ArtistList';
import AlbumList from '@/components/player/AlbumList';
import SongList from '@/components/player/SongList';
import { Player } from '../../Player';
import { MusicService } from '../../providers/music.service';

export default {
  name: 'PlayerContainer',

  data () {
    return {
      music_data: null,
      artist_selected: null,
      song_selected: null,
      i_song_selected: null,
      playlist: [],
      player: null
    }
  },

  created: function() {
    new MusicService()
      .then(data => {
        console.log(data);
        this.music_data = data;
        console.info('Datos de música recuperados del servidor');
      });
  },

  mounted: function() {
    this.player = new Player();
  },

  computed: {
    getArtists: function() {
      if (this.music_data) {
        return this.music_data.map(a => {
          return { name: a.name, id: a.id};
        });
      }
      else return [];
    },

    getAlbums: function() {
      if (this.music_data && !this.artist_selected)
        return this.music_data.map(a => a.albums).reduce((a,b) => (a.length) ? a.concat(b) : b, [])
      else if (this.music_data && this.artist_selected)
        return this.music_data.find(a => a.id == this.artist_selected.id).albums;
      else
        return [];
    },

    getSongs: function() {
      if (this.music_data && !this.$refs.album_list.album_selected)
        return this.getAlbums.map(a => a.songs).reduce((a,b) => (a.length) ? a.concat(b) : b, []);
      else if (this.music_data && this.$refs.album_list.album_selected)
        return this.getAlbums.find(a => a.id == this.$refs.album_list.album_selected).songs;
      else
        return [];
    }
  },

  methods: {
    selectArtist: function(artist) {
      this.$refs.album_list.album_selected = null;
      if (artist == 'all') this.artist_selected = null;
      else this.artist_selected = artist;

    },
    selectSong: function(song) {
      this.song_selected = song;
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
