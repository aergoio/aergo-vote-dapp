import Vue from 'vue'
import Router from 'vue-router'
import AccountDetail from './views/AccountDetail'
import SystemVoting from './views/SystemVoting'
import About from './views/About'
import Login from './views/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: About,
      name: 'about',
    },
    {
      path: '/voting/:id',
      name: 'voting',
      component: SystemVoting,
      props: true
    },
    {
      path: '/account/:address',
      name: 'account',
      component: AccountDetail,
      props: true
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
    },
  ]
})
