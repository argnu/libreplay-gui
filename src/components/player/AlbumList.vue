<template>
  <div>
    <p class="menu-label">
      Albums
    </p>
    <div v-for="album in list" class="album"  :class="{ 'is-active': selected === album.id }" @click="select(album.id)">
        <figure class="image is-128x128">
          <img :src="album.art ? 'http://localhost:3000/files/album-art/'+album.id : '/static/noart.jpg'">
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
      selected: ''
    }
  },

  methods: {
    select: function(album) {
      this.selected = album;
      this.$emit('select', album);
    }
  }
}
</script>

<style>
.album {
  cursor: pointer;
  display: inline-block;
  padding:10px;
  max-width: 148px;
}

.album.is-active {
  background-color: rgb(0,196,167);
  color: white;
}

.album-subtitle {
  font-size: 70%;
  display: flex;
}
</style>
