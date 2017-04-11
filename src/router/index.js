//jshint esversion:6

import Vue from 'vue';
import Router from 'vue-router';
import Container from '@/components/Container';
import Login from '@/components/Login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Container',
      component: Container
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
});
