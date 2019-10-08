import Vue from 'vue'
import Router from 'vue-router'
import AccountDetail from './components/AccountDetail'
import SystemVoting from './components/SystemVoting'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: SystemVoting,
      props: {id: 'BP'}
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
