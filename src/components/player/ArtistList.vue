<template>
  <div>
    <aside class="menu">
      <p class="menu-label">
        Artistas
      </p>

      <p class="control has-icons-right" style="margin-bottom:10px">
        <input class="input" type="text" placeholder="Buscar artista..." @keyup="filter" v-model="search_artist">
        <span class="icon is-small is-right">
          <i class="fa fa-search"></i>
        </span>
      </p>

      <ul class="menu-list is-fullwidth" id="list-artists">
        <li><a :class="{ 'is-active': !selected }" @click="select('')">Todos los artistas</a></li>
        <li class="artist-link" v-for="artist in list_show">
          <a :class="{ 'is-active': selected === artist.id }" @click="select(artist.id)">
            {{ artist.name  }}
          </a>
          <i class="fa fa-play" @click="playArtist(artist)"></i>
          <i class="fa fa-plus" @click="addArtistToPlaylist(artist)"></i>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import * as _ from 'lodash';

export default {
  name: 'ArtistList',
  props: ['list'],

  data () {
    return {
      selected: '',
      search_artist: '',
      list_show: []
    }
  },

  watch: {
    list: function() {
      this.list_show = this.list;
    }
  },

  methods: {
    select: function(id) {
      this.selected = id;
      this.$emit('select', id);
    },

    filter: function () {
      _.debounce(this.filterArtists, 100, { 'maxWait': 1000 })();
    },

    filterArtists: function() {
      this.list_show = this.list.filter(a => a.name.toLowerCase().includes(this.search_artist.toLowerCase()));
    },

    addArtistToPlaylist: function(artist) {
      this.$emit('addArtistToPlaylist', artist);
    },

    playArtist: function(artist) {
      this.$emit('playArtist', artist);
    },
  }
}
</script>

<style>
@media (max-width: 768px) {
  #list-artists {
    max-height: 200px;
    overflow-y: auto;
  }
}

@media (min-width: 770px) {
  #list-artists {
    max-height: 350px;
    width: 100%;
    overflow-y: scroll;
  }
}

.artist-link i {
  display: none;
  background: black;
  border-radius: 15%;
  padding: 2%;
  color: white;
  font-size: 70%;
}

.artist-link:hover i{
  display: inline-flex;
}

.artist-link i:hover {
  font-weight: bold;
  font-size: 100%;
}

.artist-link i.fa-play {
  margin-left: 70%;
  margin-top: -10%;
}

.artist-link i.fa-plus {
  margin-top: -10%;
}
</style>
