<template>
  <div>
    <input type="text" v-model="path">
    <button type="button" v-on:click="scan">Scan</button>
    <br><br>
    <ul>
      <li v-for="msg in msgs">
        {{ msg  }}
      </li>
    </ul>
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
      xhttp.open("GET", "http://localhost:3000/scan", true);
      xhttp.send();
    }
  },
  created: function() {
    socket.on('new-song', data => {
      console.log(data);
    });
    socket.on('newfile', data => {
      console.log(data);
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
