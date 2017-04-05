//jshint esversion:6

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import { MusicService } from './providers/music.service';


Vue.config.productionTip = false;
var MUSIC = new MusicService();


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  provide: {
    MUSIC
  },
  beforeCreate: function() {
    MUSIC.init();
  }
});
