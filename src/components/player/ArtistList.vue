<template>
  <div>
    <aside class="menu">
      <p class="menu-label">
        Artistas
      </p>
      <ul class="menu-list">
        <li><a :class="{ 'is-active': !selected }" @click="select('')">Todos los artistas</a></li>
        <a :class="{ 'is-active': selected === artist.id }" @click="select(artist.id)" v-for="artist in list">
          {{ artist.name  }}
        </a>
      </ul>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'ArtistList',
  props: ['list'],

  data () {
    return {
      selected: ''
    }
  },

  methods: {
    select: function(id) {
      this.selected = id;
      this.$emit('select', id);
    }
  }
}
</script>

<style>
</style>
