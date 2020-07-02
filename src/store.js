import Vue from 'vue'
import Vuex from 'vuex'
import connectAergo from './provider'
import votes from './votes.json';
import {Contract} from '@herajs/client';

Vue.use(Vuex)

async function connectContract(aergo, query) {
  const address = process.env.VUE_APP_CONTRACT_ADDRESS;
  const contract = Contract.atAddress(address);
  contract.loadAbi(await aergo.getABI(address));
  return await aergo.queryContract(contract.invoke(...query))
}

function getStatus({startDate,endDate,status}) {
  const current = new Date().getTime() / 1000;

  if (current < startDate && status.toLowerCase() === 'open') {
    return 'register'
  } else if (current > startDate && current < endDate) {
    return status.toLowerCase() === 'open' ? 'open' : 'closed'
  } else if (current > endDate) {
    return status.toLowerCase() === 'open' ? 'finished' : 'closed'
  }
}

function toUTC(time) {
  return new Date(Date.UTC(time.getFullYear(), time.getMonth(), time.getDate())).getTime() / 1000;
}

export default new Vuex.Store({
  state: {
    aergo: null,
    contract: null,
    systemVotings: Object.freeze(Object.keys(votes).map(key => ({id: key}))),
    blocksByHash: {},
    activeChainId: '',
    activeAccount: null,
    isCouncilor: false,
    when: '...',
    staked: '...',
    balance: '...',
    connectionError: false,
    agora: [],
    status: [
      {
        label: 'Status',
        value: 'all'
      },
      {
        label: 'register',
        value: 'register'
      },
      {
        label: 'open',
        value: 'open',
      },
      {
        label: 'finished',
        value: 'finished',

      },
      {
        label: 'closed',
        value: 'closed',

      },

    ],
    isLoading: false
  },
  mutations: {
    setAergo(state, url) {
      state.aergo = connectAergo(url)
    },
    setActiveChainId(state, chainId) {
      state.activeChainId = chainId
    },
    setBlockDetail(state, {block}) {
      state.blocksByHash[block.header.blockno] = block
    },
    setActiveAccount(state, account) {
      state.activeAccount = account
    },
    setWhen(state, when) {
      state.when = when
    },
    setStaked(state, staked) {
      state.staked = staked
    },
    setBalance(state, balance) {
      state.balance = balance
    },
    setConnectionError(state, error) {
      state.connectionError = error;
    },
    setAgora(state, votes) {
      state.agora = votes;
    },
    setStatus(state, status) {
      state.status = status;
    },
    setLoading(state, loading) {
      state.isLoading = loading;
    },
    setUserCouncilor(state, councilor) {
      state.isCouncilor = councilor;
    }
  },
  actions: {
    getAergo({commit, state}, {url}) {
      if (!state.aergo) {
        commit('setAergo', {url})
      }
      commit('setConnectionError', false);
      state.aergo.getChainInfo().then((result) => {
        commit('setActiveChainId', result)
      }).catch(() => {
        commit('setConnectionError', `Failed to connect to Aergo node at ${url}. Please try again later.`);
      });
    },
    getBlock({dispatch, state}, {blockNoOrHash}) {
      if (state.blocksByHash[blockNoOrHash]) {
        //console.log('return block from cache', blockNoOrHash)
        return new Promise((resolve) => {
          resolve(state.blocksByHash[blockNoOrHash])
        })
      }
      return dispatch('fetchBlock', {blockNoOrHash})
    },
    async fetchBlock({commit}, {blockNoOrHash}) {
      const block = Object.freeze(await this.state.aergo.getBlock(blockNoOrHash))
      commit('setBlockDetail', {block})
      //console.log('return block', block)
      return block
    },
    async getTopVotes(context, {count, id}) {
      return this.state.aergo.getTopVotes(count, id)
    },
    async getAccountVotes(context, {address}) {
      return this.state.aergo.getAccountVotes(address)
    },
    getActiveAccount({commit, state, dispatch}) {
      if (state.activeAccount) {
        return new Promise((resolve) => {
          resolve(state.activeAccount)
        })
      }
      return new Promise((resolve, reject) => {
        window.addEventListener('AERGO_ACTIVE_ACCOUNT', function (event) {
          if ('error' in event) {
            reject(new Error('request was cancelled by user'));
            return;
          }
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
          dispatch('isCouncilor',event.detail.account.address);
          resolve(event.detail.account)
        }, {once: true})
        window.postMessage({
          type: 'AERGO_REQUEST',
          action: 'ACTIVE_ACCOUNT'
        })
      })
    },
    async getAccountDetail(context, {address}) {
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
    refreshActiveAccount({commit}) {
      commit('setActiveAccount', null)
      commit('setUserCouncilor',false)
      return this.dispatch('getActiveAccount')
    },
    async getAgoraList({state, commit}) {
      const queryResult = await connectContract(state.aergo, ['listAgendas'])
      const data = queryResult.reduce((accm, curr) => {

        curr.yes = curr.confirm._bignum
        curr.no = curr.reject._bignum
        curr.curStatus = getStatus(curr)

        if (curr.curStatus === 'open') {
          const time = (new Date(curr.endDate * 1000).getTime() - new Date().getTime()) / 1000 / 60;
          curr.leftTime = time < 60 ? (time < 1 ? '<1m' : Math.floor(time) + 'm') : Math.floor(time / 60) + 'h';
        }


        return [curr, ...accm]
      }, [])
      commit('setAgora', data)
    },
    async getStatus({state, commit}) {
      const queryResult = await connectContract(state.aergo, ['listStatus'])
      commit('setStatus', queryResult)
    },
    fetchAgenda({state, commit}, agenda) {
      if (!state.activeAccount) {
        return;
      }
      return new Promise((resolve, reject) => {
        window.addEventListener('AERGO_SEND_TX_RESULT', function (event) {
          commit('setLoading', true)
          if ('error' in event) {
            reject(new Error('request was cancelled by user'));
          } else {
            resolve(event.detail.hash)
          }
        }, {once: true});

        window.postMessage({
          type: 'AERGO_REQUEST',
          action: 'SEND_TX',
          data: {
            from: state.activeAccount.address,
            to: process.env.VUE_APP_CONTRACT_ADDRESS,
            amount: 0,
            type: 3, // delegation fee
            payload_json: {
              Name: 'invoke',
              Args: ['issueAgenda',
                agenda.hash,
                agenda.aip,
                agenda.title,
                agenda.url,
                agenda.category,
                '',
                agenda.startDate,
                agenda.endDate]
            }
          }
        });
      });
    },
    fetchVote({state, commit}, {hash, result}) {
      const temp= ['confirmAgenda','rejectAgenda','closeAgenda'];

      return new Promise((resolve, reject) => {
        window.addEventListener('AERGO_SEND_TX_RESULT', function (event) {
          commit('setLoading', true)
          if ('error' in event) {
            reject(new Error('request was cancelled by user'));
          } else {
            resolve(event.detail.hash)
          }
        }, {once: true});

        window.postMessage({
          type: 'AERGO_REQUEST',
          action: 'SEND_TX',
          data: {
            from: state.activeAccount.address,
            to: process.env.VUE_APP_CONTRACT_ADDRESS,
            type: 3,
            amount: 0,
            payload_json: {
              Name: 'invoke',
              Args: [
                temp[result],
                hash]
            }
          }
        });
      });
    },
    getReceipt({state}, hash) {
      return state.aergo.getTransactionReceipt(hash.toString());
    },
    async alreadyVoted({state}, {hash}) {
      if (!state.activeAccount || hash === '') {
        return true;
      }
      return await connectContract(state.aergo, ['alreadyVoted', hash, state.activeAccount.address]);
    },
    async isCouncilor({state,commit},address) {
      const queryReturn = await connectContract(state.aergo, ['isCouncilor', address])
      commit('setUserCouncilor',queryReturn)
    },
  },
  getters: {
    govDetail: state => id => state.agora.find(i => i.hash === id),
    agoraList: state => (category, status, {start, end}) => {
      if (category === 'all' && status === 'all' && !start && !end) {
        const list = state.agora.reduce((accm, curr) => {
          accm[curr.curStatus === 'open' ? 'Active' : 'InActive'].push(curr);
          return accm;
        }, {'Active': [], 'InActive': []});

        return [
          {title: 'Active', data: list['Active']},
          {title: 'InActive', data: list['InActive']}
        ];
      } else {
        return [{
          title: 'Search Result',
          data: state.agora.filter(i => {
            if ((category === 'all' || category === i.category.toLowerCase())
                            && (status === 'all' || status === i.curStatus.toLowerCase())
                            && (start === null || ((toUTC(start) <= i.startDate) && (toUTC(end) + 28800 >= i.endDate)))) {
              return i;
            }
          })
        }]
      }
    }
  }
})