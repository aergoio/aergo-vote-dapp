<template>
  <v-container
    fluid
  >
    <v-row
    >
      <v-col class="text-center">
        <v-card v-if="!votesList || !votesList.length">Loading...</v-card>
        Vote : {{id}}
        <v-simple-table 
          v-if="votesList && votesList.length"
          dense
        >
          <thead>
            <tr>
              <th>Pos.</th>
              <th>Candidates</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tr 
            v-for="(item, index) in votesList"
            :key="item.candidate">
            <td>{{index+1}}</td>
            <td v-on:click="addSelected(item)">
              {{item.candidate}}
            </td>
            <td>
              {{item.amount.toUnit('aergo').toString()}}
            </td>
          </tr>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
    
      <v-col
            v-for="(item, i) in selections"
            :key="item"
        class="shrink"
      >
        <v-chip
          class="ma-2"
          close
          @click:close="selected.splice(i, 1)"
        >
        {{ item }}
        </v-chip>
      </v-col>
      <v-col>
        <v-btn v-on:click="requestVote()">Vote</v-btn>
        <v-card>
          {{ resultTxHash }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'system-voting',
  props: ['id'],
  methods: {
    addSelected (candidate) {
      this.selected.push(candidate)
    },
    async requestVote () {
      console.log('request Vote', this.selected)
      let account = await this.$store.dispatch('getActiveAccount')
      this.tx.from = account.address
      this.tx.payload_json.Args = [this.$props.id].concat(this.selections)
      let data = this.tx
      window.addEventListener('AERGO_SEND_TX_RESULT', function (event) {
        console.log('AERGO_SEND_TX_RESULT', event.detail)
        this.txhash = event.detail.hash
      }, { once: true })
      window.postMessage({
        type: 'AERGO_REQUEST',
        action: 'SEND_TX',
        data
      })
    },
    async loadVotes () {
      try {
        const votesList = await this.$store.dispatch('getTopVotes', { count: 50, id: this.$props.id === 'BP' ? 'voteBP' : this.$props.id })
        for (let vote of votesList) {
          vote.amount = Object.freeze(vote.amount) // prevent Vue from adding observer to Amount
        }
        this.votesList = votesList
      } catch (e) {
        console.error(e)
      }
    }
  },
  computed: {
    allSelected () {
      return this.selected.length === 2
    },
    selections () {
      const selections = []

      for (const s of this.selected) {
        selections.push(s.candidate)
      }

      return selections
    },
    resultTxHash () {
      return this.txhash
    },
    bpNumber () {
      if (this.chainInfo && this.chainInfo.bpnumber) {
        return this.chainInfo.bpnumber
      }
      return 0
    }
  },
  created () {
  },
  mounted () {
    this.loadVotes()
  },
  data () {
    return {
      //votesList: [{candidate:'test'},{candidate:'test2'}],
      votesList: [],
      tx: JSON.parse(`{
        "from": "",
        "to": "aergo.system",
        "type": 1,
        "amount": "0 aer",
        "payload_json": {
          "Name": "v1voteProposal",
          "Args": []
        }
      }`),
      txhash: '',
      selected: [],
      message: 'Welcome to Your Vue.js App'
    }
  }
}
</script>