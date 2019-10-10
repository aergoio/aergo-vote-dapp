import Vue from 'vue'
import Vuex from 'vuex'
import aergo from './provider'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    systemVotings: Object.freeze([
      { id: 'BP' },
      { id: 'BPCOUNT' },
      { id: 'GASPRICE' },
      { id: 'STAKINGMIN' },
      { id: 'NAMEPRICE' }
    ]),
    activeChainId: '',
    activeAccount: null,
    when: '...',
    staked: '...' ,
    balance: '...'
  },
  mutations: {
    setActiveChainId (state, chainId) {
      state.activeChainId = chainId
    },
    setActiveAccount (state, account) {
      state.activeAccount = account
    },
    setWhen(state, when) {
      state.when = when
    },
    setStaked (state, staked) {
      state.staked = staked
    },
    setBalance (state, balance) {
      state.balance = balance
    },
  },
  actions: {
    async getTopVotes (context, { count, id }) {
      return aergo.getTopVotes(count, id)
    },
    async getAccountVotes (context, { address }) {
      return aergo.getAccountVotes(address)
    },
    getActiveAccount ({ commit, state }) {
      if (state.activeAccount) {
        return new Promise((resolve) => {
          resolve(state.activeAccount)
        })
      }
      return new Promise((resolve) => {
        window.addEventListener('AERGO_ACTIVE_ACCOUNT', function (event) {
          commit('setActiveAccount', event.detail.account)
          aergo.getStaking(event.detail.account.address)
          .then((staked) => {
            commit('setWhen', staked.when)
            commit('setStaked', staked.amount.toUnit('aergo').toString())
          })
          aergo.getState(event.detail.account.address)
          .then((as) => {
            commit('setBalance', as.balance.toUnit('aergo').toString())
          })
          resolve(event.detail.account)
        }, { once: true })
        window.postMessage({
          type: 'AERGO_REQUEST',
          action: 'ACTIVE_ACCOUNT'
        })
      })
    },
    async getAccountDetail (context, { address }) {
      const staked = await aergo.getStaking(address)
      const state = await aergo.getState(address)
      return {
        staked: staked.amount.toUnit('aergo').toString(),
        when: staked.when,
        balance: state.balance.toUnit('aergo').toString()
      }
    },
    refreshActiveAccount ({commit, state}) {
      commit('setActiveAccount', null)
      return this.dispatch('getActiveAccount')
    }
  },
})
