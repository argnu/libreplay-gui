<template>
  <div>
    <table class="ui very basic table selectable" style="cursor:pointer">
      <thead>
        <tr>
          <th>Play</th>
          <th>Add</th>
          <th>Track</th>
          <th>Name</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr @click="select(song)" type="button" v-for="song in list">
          <td><a class="ui label" @click="addAndPlay(song)"><i class="play icon"></i></a></td>
          <td><a class="ui label" @click="add(song)"><i class="plus icon"></i></a></td>
          <td>{{ song.track }}</td>
          <td>{{ song.name }}</td>
          <td>{{ song.artistName}}</td>
          <td>{{ song.albumName }}</td>
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
</style>
