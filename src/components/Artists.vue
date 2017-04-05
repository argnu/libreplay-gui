<template>
  <div>
    <h2>Artistas</h2>
    <br>
    <div>
      <button @click="select(artist)" v-for="artist in MUSIC.artists">
        {{ artist.name  }}
        <br>
      </button>
    </div>
    <br>
    <div>
      <button @click="selectAlbum(album)" type="button" v-for="album in albums">
        {{ album.name }}
      </button>
    </div>
    <br>
    <div>
      <div v-for="song in songs">
        <button @click="selectSong(song)" type="button">
          {{ song.name }}
        </button>
        <br>
      </div>
    </div>
    <br>
    <div v-if="selected_song">
      <audio ref="player" controls>
       <source :src="songUrl" type="audio/mpeg">
        Your browser does not support the audio element.
     </audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'artists',
  data () {
    return {
      artists: [],
      albums: [],
      songs: [],
      selected_song: null
    }
  },
  mounted: function () {
      this.$watch('selected_song', function() {
          this.$refs.player.load()
      });
      console.log(this.$refs)
  },
  computed: {
    songUrl: function() {
      return 'http://localhost:3000/files/songs/' + this.selected_song.id;
    }
  },
  inject: [ 'MUSIC' ],
  methods: {
    select: function(artist) {
      this.albums = artist.albums;
    },
    selectAlbum: function(album) {
      this.songs = album.songs;
    },
    selectSong: function(song) {
      this.selected_song = song;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
