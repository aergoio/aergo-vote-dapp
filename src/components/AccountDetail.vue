<template>
  <v-container
    fluid
  >
    <v-row
    >
      <v-col class="text-center">
        <v-card-text v-if="address">
            <p>{{ address }}</p>
            <p>staked : {{ staked }}</p>
            <p>balance : {{ balance }}</p>
            <p>last action : block No {{ when }}</p>
            <div v-if="voteHistory">
            <p
              v-for="v in voteHistory.getVotingList()"
              v-bind:key="v.getId()"
            >
              {{ v }}
            </p>
            </div>
        </v-card-text>
        <v-card-actions>
        <v-btn @click="loadAccountVotes()">test</v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>

</template>
<script>
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
      async loadAccountVotes () {
        const result = await this.$store.dispatch('getAccountVotes', { address: this.address })
        this.voteHistory = result
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
    accountDetail : null,
    voteHistory: null
  })
}
</script>