<template>
  <div>
    <table class="ui very basic table selectable" style="cursor:pointer">
      <thead>
        <tr>
          <th>Track</th>
          <th>Name</th>
          <th>Artist</th>
          <th>Album</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr @click="select(song)" type="button" v-for="song in list">
          <td>{{ song.track }}</td>
          <td>{{ song.name }}</td>
          <td></td>
          <td></td>
          <td></td>
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
    }
  }
}
</script>

<style>
</style>
