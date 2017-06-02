<template>
  <div>

    <nav class="nav">
      <div class="nav-left">
          <router-link to="/" class="nav-item">
            <img src="static/logo.png" alt="Liberascio"/>
            <span class="nav-item">LibrePlay</span>
          </router-link>
      </div>

      <div class="nav-center">
      </div>

      <div class="nav-right nav-menu">
        <div class="nav-item" v-if="user">
          <div class="has-dropdown" style="padding:5px">
            <input type="checkbox" id="ch1">
            <label class="button  " for="ch1">
              <span> {{ username }}</span>
              <span class="icon is-small">
                <i class="fa fa-wrench"></i>
              </span>
            </label>

            <div class="dropdown box">
              <ul>
                <li>
                  Load Playlist <i class="fa fa-list"></i>
                </li>
                <hr>
                <li v-if="user.data.admin">User Config <i class="fa fa-user"></i></li>
                <hr>
                <li v-if="user.data.admin">
                  <router-link to="/admin">
                    System Config <i class="fa fa-cog"></i>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p class="nav-item" v-if="!user">
          <a class="button">
            <router-link to="/login">
              Sign In <i class="fa fa-sign-in"></i>
            </router-link>
          </a>
        </p>
      </div>
    </nav>

    <notification ref="notification" :msg="msg_notification"></notification>

    <div style="margin-top:5%">
      <router-view></router-view>
    </div>


    <!-- <footer class="footer" @click="p">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>LibrePlay</strong> by <a href="http://liberascio.org">Liberascio</a>.
          </p>
        </div>
      </div>
    </footer> -->
  </div>
</template>

<script>
import Notification from '@/components/Notification';
import { socket } from './socket';
import * as _ from 'lodash';
import * as axios from 'axios';
import * as Cookies from 'js-cookie';

export default {
  name: 'app',

  data()  {
    return {
      msg_notification: '',
      user: null
    }
  },

  created: function() {
    this.user = Cookies.get('LibrePlayUser') ? JSON.parse(Cookies.get('LibrePlayUser')) : null;
    console.log(this.user);
    let debounced = _.debounce(this.setNotification, 300, { 'maxWait': 1000 });
    socket.on('new-artist', artist => debounced(`Artista añadido: "${artist.name}"`));
    socket.on('new-album', album => debounced(`Album añadido: "${album.name}"`));
  },

  computed: {
    username: function() {
      if (this.user) return this.user.data.first_name + ' ' + this.user.data.last_name;
      else return '';
    }
  },

  methods: {
    setNotification: function(msg) {
      this.msg_notification = msg;
      this.$refs.notification.show = true;
      setTimeout(() => {
        this.msg_notification = '';
        this.$refs.notification.show = false;
      }, 2000);
    }
  },

  components: {
    Notification
  }
}
</script>

<style scoped>
@import '../node_modules/bulma/css/bulma.css';
@import '../node_modules/font-awesome/css/font-awesome.min.css';
@import '../node_modules/animate.css/animate.min.css';


.nav-item img {
  margin-left: 30px;
  height: auto;
}

nav {
  border-top-style: solid;
  border-bottom-style: solid;
  border-width: 0.5px;
  border-color: orange;

}

/* wrapper */
.has-dropdown input[type="checkbox"] {
  display: none;
}

.has-dropdown input[type="checkbox"]:checked ~ .dropdown {
  display: block;
}

/* dropdown basic */
.dropdown {
  display: none;
  position: absolute;
  z-index: 9999;
  text-align: right;
}

.dropdown hr {
  margin: 5px 0px 5px 0px;
  padding: 0;
}

.dropdown i {
  margin-top: 5px;
}

.dropdown a {
  color: rgb(74,74,74);
}

/* dropdown optional styling */
.dropdown li:hover {
  cursor: pointer;
  font-weight: bold;
}

</style>
