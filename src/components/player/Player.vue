<template>
  <div>
    <div class="aplayer" ref="player">
    </div>
  </div>
</template>

<script>
import { APlayer } from '../../APlayer';

function getSongUrl(song) {
  return 'http://localhost:3000/files/songs/' + song.id;
}

function getAlbumArt(song) {
  console.log('http://localhost:3000/files/album-art/' + song.albumId);
  return 'http://localhost:3000/files/album-art/' + song.albumId;
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
          music: {
            title: song.name,
            author: song.artist.name,
            url: getSongUrl(song),
            pic: getAlbumArt(song)
          }
      });

      this.player.on('save', (list) => {
        console.log(list);
      });

      this.player.on('destroy', () => {
        this.player.destroy();
        this.player = null;
      });
    },

    addSong: function(song) {
      console.log(this.player);
      if (!this.player) this.createPlayer(song);
      else {
        this.player.addMusic([{
          title: song.name,
          author: song.artist.name,
          url: getSongUrl(song),
          pic: getAlbumArt(song)
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
