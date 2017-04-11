<template>
  <div>
    <a class="ui label" @click="previous"><i class="backward icon"></i></a>
    <audio ref="player" controls @ended="next">
     <source :src="source" type="audio/mpeg">
      Your browser does not support the audio element.
   </audio>
   <a class="ui label" @click="next"><i class="forward icon"></i></a>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: ['source'],
  data () {
    return {
    }
  },
  methods: {
    next: function() {
      this.$emit('next');
    },
    previous: function() {
      this.$emit('previous');
    }
  },
  mounted: function () {
      this.$watch('source', function() {
          this.$refs.player.load();
          this.$refs.player.play();
      });
  }
}
</script>

<style>
</style>
