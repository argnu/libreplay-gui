<template>
  <div id="app">
    <notification ref="notification" :msg="msg_notification"></notification>
    <div id="header" class="columns">
      <div class="column is-1">
        <img src="static/logo.png" alt="Liberascio"/>
      </div>
      <div class="column">
        <h1 class="title">
          LibrePlay
        </h1>
        <h2 class="subtitle">
          Reproductor de música libre
        </h2>
      </div>
    </div>

    <br>

    <router-view></router-view>

    <br>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>LibrePlay</strong> by <a href="http://liberascio.org">Liberascio</a>.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Notification from '@/components/Notification';
import { socket } from './socket';
import * as _ from 'lodash';

export default {
  name: 'app',

  data()  {
    return {
      msg_notification: ''
    }
  },

  created: function() {
    let debounced = _.debounce(this.setNotification, 300, { 'maxWait': 1000 });
    // socket.on('new-song', data => debounced(`Canción añadida: "${data.name}"`));
    socket.on('new-album', data => debounced(`Album añadido: "${data.name}"`));
    socket.on('new-arist', data => debounced(`Artista añadido: "${data.name}"`));
  },

  methods: {
    setNotification: function(msg) {
      this.msg_notification = msg;
      this.$refs.notification.show = true;
    }
  },

  components: {
    Notification
  }
}
</script>

<style>
@import '../node_modules/bulma/css/bulma.css';
@import '../node_modules/font-awesome/css/font-awesome.min.css';

#header {
  /*background-color: rgb(255,221,87);*/
  border-style: solid;
  border-color: rgb(255,221,87);
  padding-top: 20px;
}

#header img {
  margin-left: 30px;
  height: 70px;
}
</style>
