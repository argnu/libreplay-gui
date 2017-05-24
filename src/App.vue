<template>
  <div>
    <notification ref="notification" :msg="msg_notification"></notification>
    <div id="app">
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

      <footer class="footer" @click="p">
        <div class="container">
          <div class="content has-text-centered">
            <p>
              <strong>LibrePlay</strong> by <a href="http://liberascio.org">Liberascio</a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import Notification from '@/components/Notification';
import { socket } from './socket';
import * as _ from 'lodash';
import * as axios from 'axios';

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
    socket.on('new-artist', artist => debounced(`Artista añadido: "${artist.name}"`));
    socket.on('new-album', album => debounced(`Album añadido: "${album.name}"`));
  },

  methods: {
    p: function() {
      axios.get('http://localhost:3000/probando');
    },

    setNotification: function(msg) {
      this.msg_notification = msg;
      this.$refs.notification.show = true;
      setTimeout(() => {
        this.msg_notification = '';
        this.$refs.notification.show = false;
      }, 2000)
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
@import '../node_modules/animate.css/animate.min.css';

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
