<template>
  <div v-show="show" id="notification">
    <div class="notification is-primary">
      <button class="delete" @click="show = !show"></button>
      {{ msg }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    msg: String,
  },

  data () {
    return {
      show: false
    }
  }
}
</script>

<style>
#notification {
	opacity: 0.6;
	position: absolute;
	z-index: 101;
	top: 20px;
	right: 10px;
}
</style>
