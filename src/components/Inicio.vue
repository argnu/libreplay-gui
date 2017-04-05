<template>
  <div>
    <h2>Scan Music Folder</h2>
    <br>
    <input type="text" v-model="path" placeholder="Ingrese el path del directorio">
    <button type="button" v-on:click="scan">Scan</button>
    <br><br>
    <div>
      <span v-for="msg in msgs">
        {{ msg  }}
        <br>
      </span>
    </div>
  </div>
</template>

<script>
import { socket } from '../socket';
export default {
  name: 'hello',
  props: ['socket'],
  data () {
    return {
      path: '',
      msgs: []
    }
  },
  methods: {
    scan: function(event) {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
          }
      };
      xhttp.open("POST", "http://localhost:3000/rest/scan", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({path:this.path}));
    }
  },
  created: function() {
    socket.on('new-song', data => {
      this.msgs.push(`Added new song "${data.name}"`);
    });
    socket.on('new-album', data => {
      this.msgs.push(`Added new album "${data.name}"`);
    });
    socket.on('new-artist', data => {
      this.msgs.push(`Added new artist "${data.name}"`);
    });
    socket.on('new-genre', data => {
      this.msgs.push(`Added new genre "${data.name}"`);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
