<template>
<div>
  <div>
    <form v-on:submit.prevent="submitUser">
      <div class="field" v-if="fields == 'all' || fields.first_name">
        <label class="label">Nombre</label>
        <p class="control">
          <input class="input"
            type="text" placeholder="Ingrese el nombre" v-model="new_user.first_name">
        </p>
      </div>

      <div class="field" v-if="fields == 'all' || fields.last_name">
        <label class="label">Apellido</label>
        <p class="control">
          <input class="input"
            type="text" placeholder="Ingrese el apellido" v-model="new_user.last_name">
        </p>
      </div>

    <div class="field" v-if="fields == 'all' || fields.email">
        <label class="label">Email</label>
        <p class="control has-icons-left has-icons-right">
          <input class="input" :class="{ 'is-danger': (submitted && !validation.email) }"
            type="text" placeholder="Ingrese el email" v-model="new_user.email">
          <span class="icon is-small is-left">
            <i class="fa fa-user"></i>
          </span>
          <span class="icon is-small is-right" v-show="submitted && !validation.email">
            <i class="fa fa-warning"></i>
          </span>
        </p>
        <p v-show="submitted && !validation.email" class="help is-danger">El email es inválido</p>
      </div>

      <div class="field" v-if="fields == 'all' || fields.password">
        <label class="label">Contraseña</label>
        <p class="control has-icons-left has-icons-right">
          <input class="input" :class="{ 'is-danger': (submitted && !validation.password) }"
            type="password" placeholder="Ingrese la contraseña" v-model="new_user.password">
          <span class="icon is-small is-left">
            <i class="fa fa-user-secret"></i>
          </span>
          <span class="icon is-small is-right" v-show="submitted && !validation.password">
            <i class="fa fa-warning"></i>
          </span>
        </p>
        <p v-show="submitted && !validation.password" class="help is-danger">Debe ingresar una contraseña</p>
      </div>

      <div class="field" v-if="fields == 'all' || fields.password">
        <label class="label">Confirmar contraseña</label>
        <p class="control has-icons-left has-icons-right">
          <input class="input" :class="{ 'is-danger': (submitted && !validation.password_confirmation) }"
            type="password" placeholder="Confirme la contraseña" v-model="new_user.password_confirmation">
          <span class="icon is-small is-left">
            <i class="fa fa-user-secret"></i>
          </span>
          <span class="icon is-small is-right" v-show="submitted && !validation.password_confirmation">
            <i class="fa fa-warning"></i>
          </span>
        </p>
        <p v-show="submitted && !validation.password_confirmation" class="help is-danger">Las contraseñas no coinciden</p>
      </div>

      <div class="field" v-if="fields == 'all' || fields.admin">
        <p class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="new_user.admin">
            Usuario administrador
          </label>
        </p>
      </div>

      <div class="field">
        <p class="control">
          <button type="Submit" class="button is-primary" style="width:100%;">
            <b>Enviar</b>
          </button>
        </p>
      </div>
    </form>
  </div>
</div>

</template>

<script>
import * as utils from '../../utils';

export default {
  name: 'user-form',
  props: ['user', 'fields'],

  data () {
    return {
      submitted: false,
      new_user: {
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        admin: false
      }
    }
  },

  created: function() {
    this.setData();
  },

  watch: {
    user: function() {
      this.setData();
    }
  },

  computed: {
    validation: function () {
      return {
        email: utils.validateEmail(this.new_user.email),
        password: this.user || this.new_user.password.length > 0,
        password_confirmation: this.user || this.new_user.password === this.new_user.password_confirmation
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
    setData: function() {
      if (this.user) {
        if (this.user.email) this.new_user.email = this.user.email;
        if (this.user.first_name) this.new_user.first_name = this.user.first_name;
        if (this.user.last_name) this.new_user.last_name = this.user.last_name;
        if (this.user.admin) this.new_user.admin = this.user.admin;
      }
    },

    submitUser: function() {
      this.submitted = true;
      if (this.isValid) {
        let user_submit = this.new_user;
        if (this.fields != 'all' && !this.fields.password) {
          delete(user_submit.password);
          delete(user_submit.password_confirmation);
        }
        this.$emit('submit', user_submit);
      }
    },

    reset() {
      this.new_user = {
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        admin: false
      }
      this.submitted = false;
    }
  }

}
</script>

<style>
</style>
