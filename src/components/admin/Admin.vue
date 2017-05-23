<template>
  <div class="container">
    <h2 class="title">Scan Folders</h2>

    <div v-for="folder in folders">
      <div class="folder">
        <input type="text" v-model="folder.path" placeholder="Ingrese el path del directorio nuevo">
        <!-- <button class="button" title="Scanear carpeta">
          <i class="fa fa-search"></i>
        </button> -->
      </div>
    </div>

    <div v-show="!validateFolders">
      <span>No puede guardar carpetas vacías</span>
      <br>
    </div>

    <br>
    <span v-if="!folders.length">No existen carpetas registradas  </span>
    <button class="button is-primary" title="Agregar carpeta" @click="addFolder">
      <i class="fa fa-plus"></i>
    </button>
    <button v-if="folders.length" class="button is-primary" @click="saveFolders">
      Guardar
    </button>
    <button v-if="folders.length" class="button is-primary" @click="scanAll">
      Analizar Todas
    </button>
  </div>
</template>

<script>
import * as axios from 'axios';
import * as Cookies from 'js-cookie';

export default {
  name: 'admin',
  props: {},
  data () {
    return {
      folders: []
    }
  },

  computed: {
    validateFolders: function() {
      return this.folders.reduce((a,b) => a && b.path.length, true);
    }
  },

  methods: {
    // scan: function(event) {
    //   axios.post('http://localhost:3000/rest/scan', {path:this.path})
    //     .then( response => {
    //       console.log(response);
    //     })
    //     .catch( error => console.log(error) );
    // }
    addFolder: function() {
      this.folders.push({
        path: ''
      });
    },

    saveFolders: function() {

    }
  },

  created: function() {
    axios.get('http://localhost:3000/rest/folders')
      .then(folders => {
        if (folders) this.folders = folders.data;
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

.folder input {
  width: 250px;
}
</style>
