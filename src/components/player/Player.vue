<template>
  <div>
    <div class="aplayer" ref="player">
    </div>
  </div>
</template>

<script>
import { APlayer } from '../../APlayer';

function getSongUrl(song) {
  return 'http://192.168.0.8:3000/files/songs/' + song.id;
}

function getAlbumArt(song) {
  return 'http://192.168.0.8:3000/files/album-art/' + song.albumId;
}

export default {
  name: 'Player',

  data () {
    return {
      player: null
    }
  },

  methods: {
    nextSong: function() {
      this.player.playNext();
    },

    createPlayer: function(song) {
      this.player = new APlayer({
          element: this.$refs.player,
          narrow: false,
          autoplay: true,
          listmaxheight: '300px',
          mode: 'circulation',
          music: {
            title: song.name,
            author: song.artist.name,
            url: getSongUrl(song),
            pic: getAlbumArt(song),
            id: song.id
          }
      });

      this.player.on('save', (list) => {
        this.$emit('savePlaylist', list);
      });

      this.player.on('destroy', () => {
        this.player.pause();
        this.$refs.player.innerHTML = '';
        this.player = null;
      });
    },

    reset: function() {
      if (this.player) this.player.pause();
      this.$refs.player.innerHTML = '';
      this.player = null;
    },

    addSong: function(song) {
      if (!this.player) this.createPlayer(song);
      else {
        this.player.addMusic([{
          title: song.name,
          author: song.artist.name,
          url: getSongUrl(song),
          pic: getAlbumArt(song),
          id: song.id
        }]);
      }
    },

    addAndPlay(song) {
      this.addSong(song);
      this.player.playLast();
    }
  }
}
</script>

<style>
</style>
