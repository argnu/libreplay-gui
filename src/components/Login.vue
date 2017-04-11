<template>
  <div class="ui middle aligned center aligned grid">
    <div class="column">
      <h2 class="ui orange image header">
        <img src="static/logo.png" class="image">
        <div class="content">
          Ingresa a libreplay!
        </div>
      </h2>
      <form class="ui large form">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" name="email" placeholder="Dirección email">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" name="password" placeholder="Contraseña">
            </div>
          </div>
          <div class="ui fluid large orange submit button">Login</div>
        </div>

        <div class="ui error message">
        </div>

        <div class="ui red message" :class="{ hidden: !auth_error}">
          <div class="header">
            Error en la autenticación
          </div>
          <ul class="list">
            <li>La combinación usuario/contraseña es incorrecta</li>
          </ul>
        </div>

      </form>

      <!-- <div class="ui message">
        No tienes una cuenta? <a href="#">Regístrate</a>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      auth_error: false
    }
  },
  methods: {
  },
  mounted: function() {
    let self = this;
    $('.ui.form').form({
        fields: {
          email: {
            rules: [ {
              type: 'empty',
              prompt: 'Debe especificar una dirección de email'
            }, {
              type: 'email',
              prompt: 'Debe especificar una dirección de email válida'
            }]
          },
          password  : {
            rules: [ {
              type: 'empty',
              prompt: 'Debe especificar una contraseña'
            }]
          }
        },
        onSuccess: function(event, fields) {
          event.preventDefault();
          self.auth_error = true;
        }
      }
    );
  }
}
</script>

<style>
</style>
