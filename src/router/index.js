//jshint esversion:6

import Vue from 'vue';
import Router from 'vue-router';
import Inicio from '@/components/Inicio';
import Artists from '@/components/Artists';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: Inicio
    },
    {
      path: '/artists',
      name: 'Artists',
      component: Artists
    }
  ]
});
