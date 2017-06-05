<template>
  <div @click="clickGral($event)">

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
            <input type="checkbox" id="drop-user" ref="check_dropdown">
            <label class="button  " for="drop-user">
              <span> {{ username }}</span>
              <span class="icon is-small">
                <i class="fa fa-wrench"></i>
              </span>
            </label>

            <div class="dropdown box" ref="body_dropdown">
              <ul>
                <li>
                  Load Playlist <i class="fa fa-list"></i>
                </li>
                <hr>
                <li @click="activate_modal = true">User Config <i class="fa fa-user"></i>
                <hr>
                </li>
                <li v-if="user.data.admin">
                  <router-link to="/admin">
                    System Config <i class="fa fa-cog"></i>
                  </router-link>
                <hr>
                </li>
                <li @click="signOut()">Sign Out <i class="fa fa-sign-out"></i></li>
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

    <div>

      <div class="modal" :class="{ 'is-active': activate_modal }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Edit User</p>
            <button class="delete" @click="activate_modal = false"></button>
          </header>
          <section class="modal-card-body">
            <user-form :fields="user_fields" :user="user.data" @submit="editUser"></user-form>
          </section>
        </div>
      </div>

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
import UserForm from '@/components/admin/UserForm';
import { socket } from '../socket';
import * as _ from 'lodash';
import * as axios from 'axios';
import * as Cookies from 'js-cookie';

export default {
  name: 'container',

  data()  {
    return {
      msg_notification: '',
      activate_modal: false,
      user: null,
      user_fields: {
        first_name: true,
        last_name: true,
        email: true
      }
    }
  },

  created: function() {
    this.user = Cookies.get('LibrePlayUser') ? JSON.parse(Cookies.get('LibrePlayUser')) : null;
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
    editUser: function(user) {
      axios.put(`http://localhost:3000/rest/users/${this.user.data.id}/?access_token=${this.user.token}`, { user: user })
           .then(r => {
             if (r.status == 200) {
               for(let key in user) {
                 this.user.data[key] = user[key];
                 Cookies.set('LibrePlayUser', this.user);
               }
               alert('Usuario modificado exitosamente!');
               this.activate_modal = false;
             }
           })
           .catch(e => {
             console.error(e);
             alert('Error de conexión con servidor');
           });
    },

    setNotification: function(msg) {
      this.msg_notification = msg;
      this.$refs.notification.show = true;
      setTimeout(() => {
        this.msg_notification = '';
        this.$refs.notification.show = false;
      }, 2000);
    },

    clickGral: function(e) {
      if (e.target.id != 'drop-user') {
        if (this.$refs.check_dropdown) this.$refs.check_dropdown.checked = false;
      }
    },

    signOut: function() {
      Cookies.remove('LibrePlayUser');
      this.user = null;
      this.$router.push({ path: '/' })
    }
  },

  components: {
    Notification,
    UserForm
  }
}
</script>

<style scoped>

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

.has-dropdown {
  min-width: 170px;
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
