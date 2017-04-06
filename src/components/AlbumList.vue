<template>
  <div>
    <div class="ui small images">
      <a href="javascript:void(0)" @click="select(album)" v-for="album in list">
        <img :src="picUrl">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumList',
  props: ['list'],
  data () {
    return {
    }
  },
  computed: {
    picUrl: function() {
      return `http://localhost:3000/files/pics/albums/2`;
    }
  },
  methods: {
    select: function(album) {
      this.$emit('select', album);
    }
  }
}
</script>

<style>
</style>
