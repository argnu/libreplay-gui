<template>
  <div class="container">
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
</template>

<script>
import * as axios from 'axios';
import * as Cookies from 'js-cookie';

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
      submitted: false
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
        if (folders) this.folders = prepareFolders(folders.data);
      })
      .catch(e => {
        console.error(e);
      })
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
