//jshint esversion:6

import Vue from 'vue';
import Router from 'vue-router';
import Inicio from '@/components/Inicio';
import Container from '@/components/Container';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: Inicio
    },
    {
      path: '/player',
      name: 'Container',
      component: Container
    }
  ]
});
