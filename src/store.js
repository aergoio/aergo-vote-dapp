import Vue from 'vue'
import Vuex from 'vuex'
import aergo from './provider'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeChainId: '',
    activeAccount: null
  },
  mutations: {
    setActiveChainId (state, chainId) {
      state.activeChainId = chainId
    },
    setActiveAccount (state, account) {
      state.activeAccount = account
    }
  },
  actions: {
    async getTopVotes ({ count }, { id }) {
      return aergo.getTopVotes(count, id)
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
          resolve(event.detail.account)
        }, { once: true })
        window.postMessage({
          type: 'AERGO_REQUEST',
          action: 'ACTIVE_ACCOUNT'
        })
      })
    }
  },
})
