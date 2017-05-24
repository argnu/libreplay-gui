<template>
  <div>
    <transition enter-active-class="animated bounceIn" leave-active-class="animated bounceOutRight">
      <div v-if="show" id="notification">
        <div class="notification is-primary">
          <button class="delete" @click="show = !show"></button>
          {{ msg }}
        </div>
      </div>
    </transition>
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
  },

  methods: {
    show: function() {
      this.show = true;
    }
  }
}
</script>

<style>
#notification {
	opacity: 0.6;
  position: fixed;
  z-index: 999;
  top: 10px;
  right: 10px;
}
</style>
