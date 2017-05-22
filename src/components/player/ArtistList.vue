<template>
  <div>
    <aside class="menu">
      <p class="menu-label">
        Artistas
      </p>
      <ul class="menu-list">
        <li><a :class="{ 'is-active': todos_active }" @click="select('all')">Todos los artistas</a></li>
        <a :class="{ 'is-active': artist.is_active }" @click="select(artist)" v-for="artist in list">
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
      todos_active: true
    }
  },
  methods: {
    select: function(artist) {
      this.setActiveFalse();
      if (artist == 'all') this.todos_active = true;
      else {
        this.todos_active = false;
        artist.is_active = !artist.is_active;
      }
      this.$emit('select', artist);
    },
    setActiveFalse: function() {
      this.list.forEach(a => {
        a.is_active = false;
      });
    }
  },
  created: function() {
    this.setActiveFalse();
  }
}
</script>

<style>
</style>
