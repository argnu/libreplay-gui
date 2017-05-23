<template>
  <div id="app">
    <div id="header" class="columns">
      <div class="column is-1">
        <img src="static/logo.png" alt="Liberascio"/>
      </div>
      <div class="column">
        <h1 class="title">
          LibrePlay
        </h1>
        <h2 class="subtitle">
          Reproductor de música libre
        </h2>
      </div>
    </div>

    <br>

    <router-view></router-view>

    <br>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>LibrePlay</strong> by <a href="http://liberascio.org">Liberascio</a>.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@import '../node_modules/bulma/css/bulma.css';
@import '../node_modules/font-awesome/css/font-awesome.min.css';

#header {
  /*background-color: rgb(255,221,87);*/
  border-style: solid;
  border-color: rgb(255,221,87);
  padding-top: 20px;
}

#header img {
  margin-left: 30px;
  height: 70px;
}
</style>
