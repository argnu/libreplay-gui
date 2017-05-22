//jshint esversion:6

import Vue from 'vue';
import Router from 'vue-router';
import PlayerContainer from '@/components/player/PlayerContainer';
import Login from '@/components/admin/Login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/player',
      name: 'PlayerContainer',
      component: PlayerContainer
    }
  ]
});
