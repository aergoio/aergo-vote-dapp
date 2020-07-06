import Vue from 'vue'
import Router from 'vue-router'
import AccountDetail from './views/AccountDetail'
import AccountStaking from './views/AccountStaking';
import SystemVoting from './views/SystemVoting'
import About from './views/About'
import FAQ from './views/FAQ'
import Login from './views/Login'
import EmptyRoute from './views/EmptyRoute';
import AccountHistory from './views/AccountHistory';
import GovVoting from './views/GovVoting';
import GovVotingView from './views/GovVotingView';
import GovVotingNew from './views/GovVotingNew';

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
      path: '/account/:address/history',
      name: 'history',
      component: AccountHistory,
      props: true
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
    },
    {
      path: '/faq',
      component: FAQ,
      name: 'faq',
    },
    {
      path: '/gov_voting',
      component: GovVoting,
      name: 'GovernanaceVoting',
    },
    {
      path: '/gov_voting/q',
      component: GovVoting,
      name: 'GovernanaceVotingQuery',
    },
    {
      path: '/gov_voting/:id',
      component: GovVotingView,
      name: 'GovernanaceVotingView',
      props: true
    },
    {
      path: '/gov_voting/proposal',
      component: GovVotingNew,
      name: 'GovernanaceVotingNew'
    }
  ]
})
