<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Creado</th>
          <th>Actualizado</th>
          <th>Admin</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, i) in users">
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.createdAt | formatDate }}</td>
          <td>{{ user.updatedAt | formatDate}}</td>
          <td>{{ user.admin | isAdmin }}</td>
          <td><i @click="edit(user)" class="fa fa-pencil"></i></td>
          <td><i @click="remove(i)" class="fa fa-trash"></i></td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import * as axios from 'axios';
import * as Cookies from 'js-cookie';
import * as utils from '../../utils';


export default {
  name: 'list-users',
  data () {
    return {
      users: []
    }
  },

  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let day = date.getDate().toString();
      let month = (date.getMonth() + 1).toString();
      return `${day.length == 1 ? `0${day}` : day}/${month.length == 1 ? `0${month}` : month}/${date.getFullYear()}`;
    },

    isAdmin: function(value) {
      if (value) return 'Sí';
      else return 'No';
    }
  },

  created: function() {
    this.admin = Cookies.get('LibrePlayUser') ? JSON.parse(Cookies.get('LibrePlayUser')) : null;
    if (this.admin) {
      axios.get(`https://localhost:3000/rest/users?access_token=${this.admin.token}`)
           .then(r => {
             this.users = r.data.data;
           });
    }
  },

  methods: {
    remove: function(i) {
      let user = this.users[i];
      axios.delete(`https://localhost:3000/rest/users/${user.id}/?access_token=${this.admin.token}`)
           .then(r => {
             console.log(r);
             this.users.splice(i, 1);
           })
           .catch(e => console.log(e));
    },

    edit: function(user) {
      this.$emit('edit', user);
    },

    refresh() {
      if (this.admin) {
        axios.get(`https://localhost:3000/rest/users?access_token=${this.admin.token}`)
             .then(r => {
               this.users = r.data.data;
             });
      }
    }
  }


}
</script>

<style>
</style>
