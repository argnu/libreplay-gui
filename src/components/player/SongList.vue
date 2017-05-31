<template>
  <div style="width:100%;">
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
          <th>Name</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr @click="select(song)" type="button" v-for="song in list_show">
          <td><i @click="addAndPlay(song)" class="fa fa-play"></i></td>
          <td><i @click="add(song)" class="fa fa-plus"></i></td>
          <td>{{ song.track }}</td>
          <td>{{ song.name }}</td>
          <td>{{ song.artist.name}}</td>
          <td>{{ song.album.name }}</td>
          <td>{{ song.duration }}</td>
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
</style>
