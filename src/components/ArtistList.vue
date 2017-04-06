<template>
  <div id="artist-list">
    <div class="ui link list relaxed divided ">
      <a :class="{ active: todos_active }" class="item" @click="select('all')">Todos los artistas</a>
      <a :class="{ active: artist.is_active }" class="item" @click="select(artist)" v-for="artist in list">
        {{ artist.name  }}
      </a>
    </div>
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
    this.todos_active = true;
    this.setActiveFalse();
  }
}
</script>

<style>
</style>
