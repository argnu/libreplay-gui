<template>
  <div>
    <div v-for="album in list" style="display:inline-block;padding:10px"
      class="album" :class="{ 'is-active': album_selected === album.id }"
      @click="select(album)">
      <figure class="image is-128x128">
        <img :src="album.art ? 'http://localhost:3000/files/pics/albums/'+album.id : 'http://bulma.io/images/placeholders/128x128.png'">
      </figure>
      <div class="album-subtitle">
        {{ album.name }}
        <br>
        {{ album.artistName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumList',
  props: ['list'],
  data () {
    return {
      album_selected: ''
    }
  },

  methods: {
    select: function(album) {
      this.album_selected = album.id;
      this.$emit('select', album);
    },

    setSelect: function(album) {
      this.album_selected = album;
    }
  }
}
</script>

<style>
.album {
  cursor: pointer;
}

.album.is-active {
  background-color: rgb(0,196,167);
  color: white;
}

.album-subtitle {
  font-size: 70%
}
</style>
