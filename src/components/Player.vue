<template>
  <div>
    <audio ref="player" controls>
     <source :src="source" type="audio/mpeg">
      Your browser does not support the audio element.
   </audio>
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
  methods: {},
  mounted: function () {
      this.$watch('source', function() {
          this.$refs.player.load()
      });
  }
}
</script>

<style>
</style>
