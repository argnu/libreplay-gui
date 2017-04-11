<template>
  <div>
      <a href="javascript:void(0)" @click="select(album)" v-for="album in list" style="display:inline-block;padding:10px">
        <div class="small image rounded">
          <img :src="picUrl">
        </div>
        <div class="ui mini label">
          {{ album.name }}
          <br>
          {{ album.artistName }}
        </div>
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
      console.log(album);
      this.$emit('select', album);
    }
  }
}
</script>

<style>
</style>
