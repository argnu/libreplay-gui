<template>
  <div>
    <p class="menu-label">
      Albums
    </p>
    <div id="list-albums">
      <div v-for="album in list" class="album"  :class="{ 'is-active': selected === album.name }" @click="select(album.name)">
          <figure class="image is-128x128" :style="{ 'background-image': album.art ? 'url(http://localhost:3000/files/album-art/' + album.name + ')' : 'url(/static/noart.jpg)' }">
            <i class="fa fa-plus" @click="addAlbumToPlaylist(album)"></i>
            <i class="fa fa-play" @click="playAlbum(album)"></i>
          </figure>
          <div class="album-subtitle">
            {{ album.name }}
            <br>
            {{ album.artistName }}
          </div>
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
    },

    addAlbumToPlaylist: function(album) {
      this.$emit('addAlbumToPlaylist', album);
    },

    playAlbum: function(album) {
      this.$emit('playAlbum', album);
    },
  }
}
</script>

<style>
  @media (max-width: 768px) {
    #list-albums {
      max-height: 200px;
      overflow-y: auto;
    }
  }

  @media (min-width: 770px) {
    #list-albums {
      max-height: 350px;
      width: 98%;
      overflow-y: scroll;
    }
  }

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

.image i {
  display: none;
}

.image:hover i{
  display:block;
}

.image i:hover {
  font-weight: bold;
  font-size: 120%;
}

.image i {
  background: rgb(38,38,38);
  border-radius: 15%;
  padding: 5px;
  color: white;
}

.image i.fa-plus {
  position: absolute;
  right: 5px;
  bottom: 2px;
}

.image i.fa-play {
  position: absolute;
  right: 32px;
  bottom: 2px;
}

figure {
  background-size: 128px 128px;
  background-repeat: no-repeat;
}
</style>
