import Vue from 'vue'
import Vuex from 'vuex'
import connectAergo from './provider'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    aergo: null,
    systemVotings: Object.freeze([
      { id: 'BP' },
      { id: 'BPCOUNT' },
      { id: 'GASPRICE' },
      { id: 'STAKINGMIN' },
      { id: 'NAMEPRICE' }
    ]),
    blocksByHash: {},
    activeChainId: '',
    activeAccount: null,
    when: '...',
    staked: '...' ,
    balance: '...',
    connectionError: false,
  },
  mutations: {
    setAergo(state, url) {
      state.aergo = connectAergo(url)
    },
    setActiveChainId (state, chainId) {
      state.activeChainId = chainId
    },
    setBlockDetail (state, {block}) {
      state.blocksByHash[block.header.blockno] = block
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
    setConnectionError (state, error) {
      state.connectionError = error;
    },
  },
  actions: {
    getAergo({ commit, state }, { url }) {
      if (!state.aergo) {
        commit('setAergo', { url })
      }
      commit('setConnectionError', false);
      state.aergo.getChainInfo().then((result) => {
        commit('setActiveChainId', result)
      }).catch((error) => {
        commit('setConnectionError', `Failed to connect to Aergo node at ${url}. Please try again later.`);
      });
    },
    getBlock ({ dispatch, state }, { blockNoOrHash }) {
      if (state.blocksByHash[blockNoOrHash]) {
          //console.log('return block from cache', blockNoOrHash)
          return new Promise((resolve) => {
              resolve(state.blocksByHash[blockNoOrHash])
          })
      }
      return dispatch('fetchBlock', { blockNoOrHash })
    },
    async fetchBlock ({ commit }, { blockNoOrHash }) {
      const block = Object.freeze(await this.state.aergo.getBlock(blockNoOrHash))
      commit('setBlockDetail', { block })
      //console.log('return block', block)
      return block
    },
    async getTopVotes (context, { count, id }) {
      return this.state.aergo.getTopVotes(count, id)
    },
    async getAccountVotes (context, { address }) {
      return this.state.aergo.getAccountVotes(address)
    },
    getActiveAccount ({ commit, state }) {
      if (state.activeAccount) {
        return new Promise((resolve) => {
          resolve(state.activeAccount)
        })
      }
      return new Promise((resolve, reject) => {
        window.addEventListener('AERGO_ACTIVE_ACCOUNT', function (event) {
          commit('setActiveAccount', event.detail.account)
          state.aergo.getStaking(event.detail.account.address)
          .then((staked) => {
            commit('setWhen', staked.when)
            commit('setStaked', staked.amount.toUnit('aergo').toString())
          })
          state.aergo.getState(event.detail.account.address)
          .then((as) => {
            commit('setBalance', as.balance.toUnit('aergo').toString())
          })
          resolve(event.detail.account)
        }, { once: true })
        window.addEventListener('AERGO_ACTIVE_ACCOUNT' + '_CANCEL', function() {
          reject(new Error('request was cancelled by user'))
        }, { once: true })
        window.postMessage({
          type: 'AERGO_REQUEST',
          action: 'ACTIVE_ACCOUNT'
        })
      })
    },
    async getAccountDetail (context, { address }) {
      const [staked, state] = await Promise.all([
        this.state.aergo.getStaking(address),
        this.state.aergo.getState(address),
      ]);
      return {
        staked: staked.amount,
        when: staked.when,
        balance: state.balance,
      }
    },
    refreshActiveAccount ({ commit }) {
      commit('setActiveAccount', null)
      return this.dispatch('getActiveAccount')
    }
  },
})