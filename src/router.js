import Vue from 'vue'
import Router from 'vue-router'
import AccountDetail from './views/AccountDetail'
import AccountStaking from './views/AccountStaking';
import SystemVoting from './views/SystemVoting'
import About from './views/About'
import Login from './views/Login'
import EmptyRoute from './views/EmptyRoute';

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
      path: '/voting/',
      component: EmptyRoute,
      name: 'voting-overview',
      redirect: '/voting/BP',
      children: [
        {
          path: ':id',
          name: 'voting',
          component: SystemVoting,
          props: true
        },
      ]
    },
    {
      path: '/account/:address',
      name: 'account',
      component: AccountDetail,
      props: true,
    },
    {
      path: '/account/:address/stake',
      name: 'staking',
      component: AccountStaking,
      props: true
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
    },
  ]
})
