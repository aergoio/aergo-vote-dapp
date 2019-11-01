<template>
  <v-container
    fluid
  >
    <v-row
    >
      <v-col class="text-center">
        <v-card v-if="!votesLoad">Loading...</v-card>
        Vote : {{id}}
        <span v-if="id !== 'BP'">( Current value : {{ current }} )</span>
        <v-simple-table 
          v-if="votesList && votesList.length"
          fixed-header
          height="360px"
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
      >
        <v-text-field
          v-if="!(fullSelected)"
          v-model="candidate"
          v-on:keyup.enter="addSelected({candidate: candidate})"
          placeholder="Enter candidate"
        >
         <v-icon slot="prepend" color="gray">mdi-pencil</v-icon>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
      >
        <v-alert
          v-if="message.text"
          v-bind:type="message.type"
          dismissible
        >
          {{message.text}}
        </v-alert>
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
    </v-row>
    <v-row
    >
      <v-col
      align="center"
      justify="center"
      >
        <v-btn v-on:click="addSelected({candidate: candidate});requestVote()">Vote</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'system-voting',
  props: ['id'],
  methods: {
    addSelected (candidate) {
      if (candidate.candidate === "") {
        return
      }
      if (this.isFullSelected()) {
        this.message = {type: 'warning', text: 'already selected to the maximum'}
        return
      }
      this.selected.push(candidate)
    },
    sendTx(event) {
      console.log('AERGO_SEND_TX_RESULT', event.detail)
      this.message = {type: 'success', text: 'Result hash: ' + event.detail.hash}
    },
    async requestVote () {
      console.log('request Vote', this.selected)
      let account = await this.$store.dispatch('getActiveAccount')
      this.tx.from = account.address
      if (this.id == 'BP') {
        this.tx.payload_json.Name = "v1voteBP"
        this.tx.payload_json.Args = [].concat(this.selections)
      } else {
        this.tx.payload_json.Name = "v1voteParam"
        this.tx.payload_json.Args = [this.$props.id].concat(this.selections)
      }
      let data = this.tx
      window.addEventListener('AERGO_SEND_TX_RESULT', this.sendTx, { once: true })
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
        this.votesLoad = true
      } catch (e) {
        console.error(e)
      }
    },
    isFullSelected() {
      if (this.$props.id == 'BP') {
        return this.selected.length >= 30
      }
      return this.selected.length >= 1
    }
  },
  computed: {
    fullSelected () {
      return this.isFullSelected()
    },
    selections () {
      const selections = []

      for (const s of this.selected) {
        selections.push(s.candidate)
      }

      return selections.filter((v, i, a) => a.indexOf(v) === i)
    },
    current() {
      if (this.$store.state.activeChainId) {
        switch (this.id) {
          case 'BPCOUNT':
            return this.$store.state.activeChainId.bpnumber
          case 'STAKINGMIN':
            return this.$store.state.activeChainId.stakingminimum.toUnit('aer').toString()
          case 'GASPRICE':
            return this.$store.state.activeChainId.gasprice.toUnit('aer').toString()
          case 'NAMEPRICE':
            return this.$store.state.activeChainId.nameprice.toUnit('aer').toString()
        }
      }
      return this.$store.state.activeChainId
    }
  },
  watch: {
    '$route' (to) {
      this.id = to.params.id
      this.loadVotes()
      this.candidate = ''
      this.votesList = []
      this.votesLoad = false
      this.selected = []
      this.message = {type: 'success'}
    }
  },
  mounted () {
    this.loadVotes()
  },
  data () {
    return {
      candidate: '',
      message: {type:'success'},
      //votesList: [{candidate:'test'},{candidate:'test2'}],
      votesList: [],
      votesLoad: false,
      tx: JSON.parse(`{
        "from": "",
        "to": "aergo.system",
        "type": 1,
        "amount": "0 aer",
        "payload_json": {
          "Name": "",
          "Args": []
        }
      }`),
      txhash: '',
      selected: []
    }
  }
}
</script>
