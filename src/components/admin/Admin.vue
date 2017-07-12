<template>
  <div class="container">
    <div class="columns">
      <div class="column is-3">
        <aside class="menu">
          <p class="menu-label">
            General
          </p>
          <p class="menu-label">
            Fuentes
          </p>
          <ul class="menu-list">
            <li>
              <a :class="{ 'is-active': menu_item_selected == 'admin-folders' }"
                  @click="menu_item_selected='admin-folders'">
                Administrar Carpetas
              </a>
            </li>
          </ul>
          <p class="menu-label">
            Usuarios
          </p>
          <ul class="menu-list">
            <li><a :class="{ 'is-active': menu_item_selected == 'admin-users' }"
                @click="menu_item_selected='admin-users'">
              Administrar Usuarios
            </a></li>
            <li><a :class="{ 'is-active': menu_item_selected == 'add-user' }"
                  @click="menu_item_selected='add-user'">
              Agregar Usuario
            </a></li>
          </ul>
        </aside>
      </div>

      <div class="column">
        <div v-if="menu_item_selected == 'admin-folders'" class="box">
          <folders></folders>
        </div>

        <div v-if="menu_item_selected == 'admin-users'" class="box">
          <div class="modal" :class="{ 'is-active': activate_modal }">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Edit User</p>
                <button class="delete" @click="activate_modal = false"></button>
              </header>
              <section class="modal-card-body">
                <user-form :fields="user_fields" :user="user_selected" @submit="editUser"></user-form>
              </section>
            </div>
          </div>

          <list-users @edit="showEdit" ref="list_users"></list-users>
        </div>

        <div v-if="menu_item_selected == 'add-user'" class="box">
          <add-user></add-user>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as axios from 'axios';
import * as Cookies from 'js-cookie';
import { Config } from '../../configs/Config';
import ListUsers from '@/components/admin/ListUsers';
import AddUser from '@/components/admin/AddUser';
import UserForm from '@/components/admin/UserForm';
import Folders from '@/components/admin/Folders';

function prepareFolders(folders) {
  return folders.map(f => {
    f.submitted = false;
    f.scanning = 'off';
    return f;
  });
}

export default {
  name: 'admin',
  props: {},
  data () {
    return {
      menu_item_selected: 'admin-folders',
      user_selected: null,
      activate_modal: false,
      admin: null,
      user_fields: {
        first_name: true,
        last_name: true,
        email: true,
        admin: true
      }
    }
  },

  filters: {
    formatDate: function(value) {
      if (value) {
        let date = new Date(value);
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        return `${day.length == 1 ? `0${day}` : day}/${month.length == 1 ? `0${month}` : month}/${date.getFullYear()}`;
      }
      else return '';
    },

    sino: function(value) {
      if (value) return 'Sí';
      else return 'No';
    }
  },

  methods: {
    showEdit: function(user) {
      this.user_selected = user;
      this.activate_modal = true;
    },

    editUser: function(user) {
      axios.put(`${Config.host}/rest/users/${this.user_selected.id}/?access_token=${this.admin.token}`, { user: user })
           .then(r => {
             if (r.status == 200) {
               this.$refs.list_users.refresh();
               alert('Usuario modificado exitosamente!');
               this.activate_modal = false;
             }
           })
           .catch(e => {
             console.error(e);
             alert('Error de conexión con servidor');
           });
    },
  },

  components: {
    ListUsers,
    AddUser,
    UserForm,
    Folders
  }

}
</script>

<style>
.folder {
  margin-top: 20px;
  display: inline-flex;
}

.folder input[type="text"] {
  width: 300px;
}

.icon-button {
  cursor: pointer;
  transition: font-size 0.5s;
}

.icon-button:hover {
  font-size: 120%;
}
</style>
