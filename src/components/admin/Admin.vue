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
          <h2 class="title">Escanear Carpetas</h2>

          <table v-if="folders.length" class="table">
            <thead>
              <tr>
                <th>Directorio</th>
                <th>Último Escaneo</th>
                <th>Escaneo Completo</th>
                <th>Buscar Carátula</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(folder, i) in folders">
                <td>
                  <input class="input" type="text" v-model="folder.path"
                        :readonly="folder.scanned"
                        placeholder="Ingrese el path del directorio nuevo">
                  <p v-show="folder.submitted && !folder.path.length" class="help is-danger">Debe ingresar un directorio válido</p>
                  <p v-show="folder.scanning === 'start'" class="help is-info">Scanning folder...</p>
                  <p v-show="folder.scanning === 'complete'" class="help is-success">Scanning complete!</p>
                  <p v-show="folder.scanning === 'error'" class="help is-danger">Scanning Error. Check parameters and try again</p>
                </td>
                <td>{{ folder.last_scan | formatDate}}</td>
                <td>{{ folder.scan_finished | sino }}</td>
                <td>
                  <input type="checkbox" v-model="folder.search_art">
                </td>
                <td>
                    <i title="Scanear carpeta" @click="scan(folder)" class="fa fa-search icon-button"></i>
                </td>
                <td>
                    <i class="fa fa-trash icon-button" title="Eliminar carpeta" @click="removeFolder(i)"></i>
                </td>
              </tr>
            </tbody>
          </table>

          <span v-if="!folders.length">No existen carpetas registradas  <br></span>
          <br>
          <button class="button is-primary" title="Agregar carpeta" @click="addFolder">
            <i class="fa fa-plus"></i>
          </button>
          <button v-if="folders.length" class="button is-primary" @click="scanAll">
            Analizar Todas
          </button>
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
import * as utils from '../../utils';
import { socket } from '../../socket';
import ListUsers from '@/components/admin/ListUsers';
import AddUser from '@/components/admin/AddUser';
import UserForm from '@/components/admin/UserForm';

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
      folders: [],
      show_content: 'scan',
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
      axios.put(`http://localhost:3000/rest/users/${this.user_selected.id}/?access_token=${this.admin.token}`, { user: user })
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

    addFolder: function() {
      this.folders.push({
        path: '',
        submitted: false,
        scanned: false,
        search_art: true,
        scanning: 'off',
      });
    },

    removeFolder: function(i) {
      let folder = this.folders[i];
      this.folders.splice(i, 1);
      if (folder.id) {
        axios.delete(`http://localhost:3000/rest/folders/${folder.id}`)
             .then(r => console.log(r))
             .catch(e => console.error(e));
      }
    },

    scan: function(f) {
      if (!f.path) f.scanning = 'error';
      else {
        f.scanning = 'start';
        if (!f.id) {
          axios.post('http://localhost:3000/rest/folders', f)
            .then(r => {
              if (r.status === 200) {
                f.id = r.data.id;
                axios.post(`http://localhost:3000/rest/folders/${r.data.id}/scan`)
                    .then(r => {
                      console.info('Scanning started!');
                    })
              }
              else {
                f.scanning = 'error';
                console.error('No se pudo guardar la carpeta en la base');
              }
            })
            .catch(e => {
              f.scanning = 'error';
              console.error(e)
            });
        }
        else {
          axios.put(`http://localhost:3000/rest/folders/${f.id}`, f)
            .then(r => {
              if (r.status === 200) {
                axios.post(`http://localhost:3000/rest/folders/${f.id}/scan`)
                    .then(r => {
                      console.info('Scanning started!');
                    })
              }
              else {
                f.scanning = 'error';
                console.error('No se pudo actualizar la carpeta en la base');
              }
            })
            .catch(e => {
              f.scanning = 'error';
              console.error(e)
            });
        }
      }
    },

    scanAll: function() {
      this.folders.forEach(f => {
        this.scan(f);
      });
    },

  },

  created: function() {
    this.admin = Cookies.get('LibrePlayUser') ? JSON.parse(Cookies.get('LibrePlayUser')) : null;
    axios.get('http://localhost:3000/rest/folders')
      .then(folders => {
        if (folders && !folders.data.error) this.folders = prepareFolders(folders.data);
      })
      .catch(e => {
        console.error(e);
      });

    socket.on('scan-finished', folder => {
      this.folders = this.folders.map(f => {
        if (f.path == folder) {
          let new_f = f;
          f.scanned = true;
          f.last_scan = new Date();
          f.scan_finished = true;
          new_f.scanning = 'complete';
          return new_f;
        }
        else return f;
      })
    });

    socket.on('scan-error', folder => {
      this.folders = this.folders.map(f => {
        if (f.path == folder) {
          let new_f = f;
          new_f.scanning = 'error';
          return new_f;
        }
        else return f;
      })
    });
  },

  components: {
    ListUsers,
    AddUser,
    UserForm
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
