<template>
  <v-container
    fluid
  >
    <v-row
    >
      <v-col class="text-center">
        <v-card
        >
          <v-card-title>
            <span class="title font-weight-light">Address</span>
          </v-card-title>
          <v-card-text
            v-if="address"
            class="headline font-weight-bold">
            {{ address }}
            {{ chainId }}
          </v-card-text>
        </v-card>
        <v-card
        >
          <v-card-title>
            <span class="title font-weight-light">Staked</span>
          </v-card-title>
          <v-card-text class="headline font-weight-bold">
            {{ staked }} {{ chance }}
          </v-card-text>
        </v-card>
        <v-card
        >
          <v-card-title>
            <span class="title font-weight-light">Balance</span>
          </v-card-title>
          <v-card-text class="headline font-weight-bold">
            {{ balance }}
          </v-card-text>
        </v-card>
        <v-card
          v-if="when !== 0"
        >
          <v-card-title>
            <span class="title font-weight-light">Last action block</span>
          </v-card-title>
          <v-card-text class="headline font-weight-bold">
            No. {{ when }}
            {{ accountLastActionTime }}
          </v-card-text>
          <v-card-text class="font-weight-bold">
            (next available action : {{ when + (60*60*24) }})
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row
    >
      <v-col class="text-center">
        <div v-if="voteHistory">
          <v-expansion-panels
        v-model="votingPanel"
        multiple
      >
        <v-expansion-panel
          v-for="v in voteHistory.getVotingList()"
          v-bind:key="v.getId()"
        >
          <v-expansion-panel-header> {{ getTextID(v) }} </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card
            >
              <v-card-title>
                <span>
                  Voting power
                </span>
              </v-card-title>
              <v-card-text>
                {{ v.getAmount() }}
              </v-card-text>
            </v-card>
            <v-card
            >
              <v-card-title>
                <span>
                 Vote to
                </span>
              </v-card-title>
              <v-card-text>
                <div
                  v-for="c in v.getCandidatesList()"
                  v-bind:key="c"
                >
                {{ c }}
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
        </div>
      </v-col>
    </v-row>
  </v-container>

</template>
<script>
import JSBI from 'jsbi'

export default {
  props: ['address'],
  computed: {
    staked: {
      get () {
        if (this.accountDetail) {
            return this.accountDetail.staked
        } else {
            return '...'
        }
      },
      set (v) {
        this.accountDetail.staked = v
      }
    },
    chance () {
        if (this.accountDetail) {
          return this.accountDetail.chance
        }
        return '...'
    },
    chainId: {
      get () {
        if (this.$store.state.activeChainId != "") {
          return this.$store.state.activeChainId.chainid.magic
        }
        return ""
      }
    },
    balance: {
      get () {
        if (this.accountDetail) {
            return this.accountDetail.balance
        } else {
            return '...'
        }
      },
      set (v) {
        this.accountDetail.balance = v
      }
    },
    when: {
      get () {
        if (this.accountDetail) {
          console.log('try getblock', this.accountDetail.when)
          this.$store.dispatch('getBlock', { blockNoOrHash: this.accountDetail.when})
          .then((block) => {
            this.accountLastActionTime = new Date(block.header.timestamp/1000000)
            })
          return this.accountDetail.when
        } else {
          return '...'
        }
      },
      set (v) {
        this.$store.commit('setWhen', v)
      }
    }
  },
  methods: {
    getTextID(v) {
        if (v.getId() == 'voteBP') {
            return 'BP'
        }
        return v.getId()
    },
    async loadAccountVotes () {
      const result = await this.$store.dispatch('getAccountVotes', { address: this.address })
      this.voteHistory = result
    }
  },
  watch: {
    '$route' (to) {
      this.loadAccountVotes()
      this.$store.dispatch('getAccountDetail', { address: this.address })
      .then((d) => {
        this.accountDetail = d
      })
      this.votingPanel = []
      this.accountDetail = null
      this.accountLastActionTime = null
      this.votinghistory = null
    }
  },
  mounted() {
    this.loadAccountVotes()
    this.$store.dispatch('getAccountDetail', { address: this.address })
    .then((d) => {
      this.accountDetail = d
    })
  },
  data: () => ({
    votingPanel: [],
    accountDetail : null,
    accountLastActionTime: null,
    voteHistory: null
  })
}
</script>