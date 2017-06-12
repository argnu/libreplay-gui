<template>
  <div>
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
          <td class="is-hidden-mobile">{{ song.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: ['list'],
  data () {
    return {
      search_song: '',
      list_show: [],
      debounced: null
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
