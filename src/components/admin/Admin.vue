<template>
  <div class="container">
    <div class="columns">
      <div class="column is-3">
        <aside class="menu">
          <p class="menu-label">
            General
          </p>
          <p class="menu-label">
            Sources
          </p>
          <ul class="menu-list">
            <li>
              <a :class="{ 'is-active': menu_item_selected == 'admin-folders' }"
                  @click="menu_item_selected='admin-folders'">
                Admin Folders
              </a>
            </li>
          </ul>
          <p class="menu-label">
            Users
          </p>
          <ul class="menu-list">
            <li><a :class="{ 'is-active': menu_item_selected == 'admin-users' }"
                @click="menu_item_selected='admin-users'">
              Admin Users
            </a></li>
            <li><a :class="{ 'is-active': menu_item_selected == 'add-user' }"
                  @click="menu_item_selected='add-user'">
              Add User
            </a></li>
          </ul>
        </aside>
      </div>

      <div class="column">
        <div v-if="menu_item_selected == 'admin-folders'" class="box">
          <h2 class="title">Scan Folders</h2>

          <div v-for="folder in folders">
            <div class="folder">
              <input class="input" type="text" v-model="folder.path"
                :readonly="folder.scanned"
                placeholder="Ingrese el path del directorio nuevo">
              <button class="button" title="Scanear carpeta" @click="scan(folder)">
                <i class="fa fa-search"></i>
              </button>
              <button class="button" title="Eliminar carpeta" @click="removeFolder(folder)">
                <i class="fa fa-trash"></i>
              </button>
              <p class="control" style="margin-left:10px">
                <label class="checkbox">
                  <input type="checkbox" v-model="folder.search_art">
                  Find album art online
                </label>
              </p>
            </div>
            <p v-show="folder.submitted && !folder.path.length" class="help is-danger">Debe ingresar un directorio válido</p>
            <p v-show="folder.scanning === 'start'" class="help is-info">Scanning folder...</p>
            <p v-show="folder.scanning === 'complete'" class="help is-success">Scanning complete!</p>
          </div>

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
          <list-users></list-users>
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
import ListUsers from '@/components/admin/ListUsers';
import AddUser from '@/components/admin/AddUser';

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
      menu_item_selected: 'admin-folders'
    }
  },

  methods: {
    addFolder: function() {
      this.folders.push({
        path: '',
        submitted: false,
        scanned: false,
        search_art: true,
        scanning: 'off'
      });
    },

    removeFolder: function(folder) {
      this.folders = this.folders.filter(f => f.id != folder.id);
      axios.delete(`http://localhost:3000/rest/folders/${folder.id}`)
           .then(r => console.log(r))
           .catch(e => console.error(e));
    },

    scan: function(f) {
      f.scanning = 'start';
      if (!f.scanned) {
        axios.post('http://localhost:3000/rest/folders', f)
          .then(r => {
            if (r.status === 200) {
              f.scanned = true;
              axios.post(`http://localhost:3000/rest/folders/${r.data.id}/scan`)
                  .then(r => {
                    f.scanning = 'complete';
                    console.info('Scanning complete!');
                  })
            }
            else console.error('No se pudo guardar la carpeta en la base');
          })
          .catch(e => {
            console.error(e)
          });
      }
      else {
        axios.put(`http://localhost:3000/rest/folders/${f.id}`, f)
          .then(r => {
            if (r.status === 200) {
              axios.post(`http://localhost:3000/rest/folders/${f.id}/scan`)
                  .then(r => {
                    f.scanning = 'complete';
                    console.info('Scanning complete!');
                  })
            }
            else console.error('No se pudo actualizar la carpeta en la base');
          })
          .catch(e => {
            console.error(e)
          });
      }
    },

    scanAll: function() {
      this.folders.forEach(f => {
        this.scan(f);
      });
    },

  },

  created: function() {
    axios.get('http://localhost:3000/rest/folders')
      .then(folders => {
        if (folders && !folders.data.error) this.folders = prepareFolders(folders.data);
      })
      .catch(e => {
        console.error(e);
      })
  },

  components: {
    ListUsers,
    AddUser
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
</style>
