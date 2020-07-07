import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: ()=>import('./views/About'),
      name: 'about',
    },
    {
      path: '/voting/',
      component: ()=>import('./views/EmptyRoute'),
      name: 'voting-overview',
      redirect: '/voting/BP',
      children: [
        {
          path: ':id',
          name: 'voting',
          component: ()=>import('./views/SystemVoting'),
          props: true
        },
      ]
    },
    {
      path: '/account/:address',
      name: 'account',
      component: ()=>import('./views/AccountDetail'),
      props: true,
    },
    {
      path: '/account/:address/stake',
      name: 'staking',
      component: ()=>import('./views/AccountStaking'),
      props: true
    },
    {
      path: '/account/:address/history',
      name: 'history',
      component: ()=>import('./views/AccountHistory'),
      props: true
    },
    {
      path: '/login',
      component: ()=>import('./views/Login'),
      name: 'login',
    },
    {
      path: '/faq',
      component: ()=>import('./views/FAQ'),
      name: 'faq',
    },
    {
      path: '/gov_voting',
      component: ()=>import('./views/GovVoting'),
      name: 'GovernanceVoting',
    },
    {
      path: '/gov_voting/q',
      component: ()=>import('./views/GovVoting'),
      name: 'GovernanceVotingQuery',
    },
    {
      path: '/gov_voting/:id',
      component: ()=>import('./views/GovVotingView'),
      name: 'GovernanceVotingView',
      props: true
    },
    {
      path: '/gov_voting/proposal',
      component: ()=>import('./views/GovVotingNew'),
      name: 'GovernanceVotingNew'
    }
  ]
})
