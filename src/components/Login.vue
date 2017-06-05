<template>
  <div class="container">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="header">
            <img src="/static/logo.png">
            <div class="">
              <h1 class="title">
                LibrePlay
              </h1>
              <h2 class="subtitle">
                Reproductor de música libre!
              </h2>
            </div>
        </div>
      </div>
    </section>

    <div style="width:50%;margin: 0 auto">
      <br>
      <nav class="panel">
        <p class="panel-heading" style="text-align:center">
          Autenticación
        </p>

        <div class="panel-block">
          <form v-on:submit.prevent="login">
            <div class="field">
              <label class="label">Email</label>
              <p class="control has-icons-left has-icons-right">
                <input class="input" :class="{ 'is-danger': (submitted && !validation.email) }"
                  type="text" placeholder="Ingrese su email" v-model="user.email">
                <span class="icon is-small is-left">
                  <i class="fa fa-user"></i>
                </span>
                <span class="icon is-small is-right" v-show="submitted && !validation.email">
                  <i class="fa fa-warning"></i>
                </span>
              </p>
              <p v-show="submitted && !validation.email" class="help is-danger">El email es inválido</p>
            </div>

            <div class="field">
              <label class="label">Contraseña</label>
              <p class="control has-icons-left has-icons-right">
                <input class="input" :class="{ 'is-danger': (submitted && !validation.pass) }"
                  type="password" placeholder="Ingrese su contraseña" v-model="user.pass">
                <span class="icon is-small is-left">
                  <i class="fa fa-user-secret"></i>
                </span>
                <span class="icon is-small is-right" v-show="submitted && !validation.pass">
                  <i class="fa fa-warning"></i>
                </span>
              </p>
              <p v-show="submitted && !validation.pass" class="help is-danger">Debe ingresar una contraseña</p>
            </div>

            <div class="field">
              <p class="control">
                <button type="Submit" class="button is-warning" style="width:100%;">
                  <b>Enviar</b>
                </button>
              </p>
            </div>
          </form>
        </div>
      </nav>
      <article class="message is-danger" v-show="notuser">
        <div class="message-body">
          La combinación de email/contraseña ingresada es incorrecta
        </div>
      </article>
    </div>

  </div>
</template>

<script>
import { validateEmail } from '../utils';
import Cookies from 'js-cookie';
import * as axios from 'axios';

export default {
  name: 'login',
  data () {
    return {
      user: {
        email: '',
        pass: ''
      },
      submitted: false,
      notuser: false
    }
  },

  computed: {
    validation: function () {
      return {
        email: validateEmail(this.user.email),
        pass: this.user.pass.length > 0
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    }
  },

  methods: {
    login: function() {
      this.submitted = true;
      if (this.isValid) {
        axios.post('http://localhost:3000/rest/users/authenticate', this.user)
          .then(r => {
            if (r.status === 200) {
              Cookies.set('LibrePlayUser', JSON.stringify(r.data), 1);
              this.$router.push({ path: '/', params: { user_id: r.data.data.id } });
            }
            else this.notuser = true;
          })
          .catch(e => {
            console.error(e);
            this.notuser = true;
          });
      }
    }
  },

}
</script>

<style>
.panel-block {
  display: block;
}

.header div {
  display: inline-block;
  margin-left: 20px;
}

.header img {
  vertical-align: middle;
  margin-left: 20px;
}
</style>
