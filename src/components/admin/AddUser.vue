<template>
<div>
  <h2 class="title" style="text-align:center">Add User</h2>
  <div>
    <user-form @submit="addUser" ref="form" fields="all"></user-form>
  </div>
</div>

</template>

<script>
import * as axios from 'axios';
import * as Cookies from 'js-cookie';
import UserForm from '@/components/admin/UserForm';

export default {
  name: 'add-user',
  data () {
    return {
      admin: null
    }
  },

  created: function() {
    this.admin = Cookies.get('LibrePlayUser') ? JSON.parse(Cookies.get('LibrePlayUser')) : null;
  },

  methods: {
    addUser: function(user) {
      axios.post(`https://localhost:3000/rest/users?access_token=${this.admin.token}`, { user: user })
           .then(r => {
             if (r.status == 201) {
               alert('Usuario agregado exitosamente!');
               this.$refs.form.reset();
             }
           })
           .catch(e => {
             console.error(e);
             alert('Error de conexión con servidor');
           });
    }
  },

  components: {
    UserForm
  }

}
</script>

<style>
</style>
