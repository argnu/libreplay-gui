<template>
  <div style="width:100%">
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
        <tr @click="select(song)" type="button" v-for="song in list">
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
    }
  }
}
</script>

<style>
i {
  cursor: pointer;
}
</style>
