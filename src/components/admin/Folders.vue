<template>
  <div>
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
</template>

<script>
import * as axios from 'axios';
import * as Cookies from 'js-cookie';
import * as utils from '../../utils';
import { socket } from '../../socket';
import { Config } from '../../configs/Config';

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
      show_content: 'scan'
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
        axios.delete(`${Config.host}/rest/folders/${folder.id}`)
             .then(r => console.log(r))
             .catch(e => console.error(e));
      }
    },

    scan: function(f) {
      if (!f.path) f.scanning = 'error';
      else {
        f.scanning = 'start';
        if (!f.id) {
          axios.post(`${Config.host}/rest/folders`, f)
            .then(r => {
              console.log(r);
              if (r.status === 201) {
                console.info(`Folder "${r.data.uri}" guardada correctamente`);
                axios.post(`${r.data.uri}/scan`)
                    .then(r => console.info('Scanning started!'))
                    .catch(e => console.log(e));
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
          axios.put(`${Config.host}/rest/folders/${f.id}`, f)
            .then(r => {
              if (r.status === 200) {
                axios.post(`${Config.host}/rest/folders/${f.id}/scan`)
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
    axios.get(`${Config.host}/rest/folders`)
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
