//jshint esversion:6

import Vue from 'vue';
import Router from 'vue-router';
import PlayerContainer from '@/components/player/PlayerContainer';
import Login from '@/components/Login';
import Admin from '@/components/admin/Admin';
import Container from '@/components/Container';
import * as Cookies from 'js-cookie';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/app'
    },
    {
      path: '/app',
      name: 'App',
      redirect: '/player',
      component: Container,
      children: [
        {
          path: '/admin',
          name: 'Admin',
          component: Admin,
          beforeEnter: (to, from, next) => {
            if (!Cookies.get('LibrePlayUser')) next({ path: '/login' });
            else next();
          }
        },
        {
          path: '/player',
          name: 'PlayerContainer',
          component: PlayerContainer
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (Cookies.get('LibrePlayUser')) next({ path: '/' });
        else next();
      }
    }
  ]
});
