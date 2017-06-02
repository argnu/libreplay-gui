//jshint esversion:6

import Vue from 'vue';
import Router from 'vue-router';
import PlayerContainer from '@/components/player/PlayerContainer';
import Login from '@/components/admin/Login';
import Admin from '@/components/admin/Admin';
import * as Cookies from 'js-cookie';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/player'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (Cookies.get('LibrePlayUser')) next({ path: '/admin' });
        else next();
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        if (!Cookies.get('LibrePlayUser')) next(false);
        else next();
      }
    },
    {
      path: '/player',
      name: 'PlayerContainer',
      component: PlayerContainer
    }
  ]
});
