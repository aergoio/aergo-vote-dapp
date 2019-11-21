<template>
  <div>
    <Vertical base="fill">
      <ViewTitle>Vote: {{id}}</ViewTitle>
      <Island>
        <span class="current-value-label">Current value: </span> 
        <span v-if="id !== 'BP'">{{current}}</span> 
        <span v-else>candidates 1-{{$store.state.activeChainId.bpnumber}}</span>
      </Island>

      <Island>
        <IslandHeader title="Candidates" />
        <VoteTable :items="votesList" :isLoading="!votesLoad" @clickCandidate="addSelected" />
      </Island>

      <Island>
        <IslandHeader title="Cast your vote" />
        <p>Select candidate(s) from above or enter manually.</p>
      
        <FilterItems :items="selected" :removeItem="removeSelected" />

        <v-text-field
          v-if="!(fullSelected)"
          v-model="candidate"
          v-on:keyup.enter="addSelected({candidate: candidate})"
          placeholder="Enter candidate manually"
        >
          <v-icon slot="prepend" color="gray">mdi-pencil</v-icon>
        </v-text-field>

        <v-alert
          v-if="message.text"
          v-bind:type="message.type"
          dismissible>
          {{message.text}}
        </v-alert>

        <Button type="primary-alt" @click="addSelected({candidate: candidate}); requestVote()" :disabled="!isButtonEnabled">Vote</Button>
      </Island>
    </Vertical>
  </div>
</template>

<script>
import VoteTable from './VoteTable';
import { ViewTitle } from '@aergoenterprise/lib-components/src/basic';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import FilterItems from '@aergoenterprise/lib-components/src/composite/forms/Filters/FilterItems.vue';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';

export default {
  components: {
    Vertical,
    Island, IslandHeader, 
    ViewTitle,
    VoteTable,
    FilterItems,
    Button,
  },
  name: 'system-voting',
  props: ['id'],
  methods: {
    addSelected (candidate) {
      if (candidate.candidate === "") {
        return;
      }
      if (this.fullSelected) {
        this.message = {type: 'warning', text: `Cannot select more than ${this.maxSelections} candidates`}
        return;
      }
      if (this.selected.indexOf(candidate) !== -1) {
        return;
      }
      this.selected.push(candidate);
      // remove duplicates
      this.selected = this.selected.filter((v, i, a) => a.indexOf(v) === i);
    },
    removeSelected(candidate) {
      this.selected = this.selected.filter(item => item !== candidate);
    },
    sendTx(event) {
      console.log('AERGO_SEND_TX_RESULT', event.detail)
      this.message = {type: 'success', text: 'Result hash: ' + event.detail.hash}
      setTimeout(()=>{
        this.loadVotes()
        this.$store.dispatch('getAergo', { url: process.env.VUE_APP_AERGO_NODE })
      }, 5000)
    },
    async requestVote () {
      console.log('Requesting vote', this.selected);
      let account = await this.$store.dispatch('getActiveAccount');
      this.tx.from = account.address
      if (this.id == 'BP') {
        this.tx.payload_json.Name = "v1voteBP";
        this.tx.payload_json.Args = [...this.selected];
      } else {
        this.tx.payload_json.Name = "v1voteDAO";
        this.tx.payload_json.Args = [this.$props.id, ...this.selected];
      }
      let data = this.tx;
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
  },
  computed: {
    fullSelected () {
      return this.selected.length >= this.maxSelections
    },
    maxSelections () {
      if (this.$props.id == 'BP') {
        return 30;
      }
      return 1;
    },
    isButtonEnabled () {
      return this.selected.length > 0 || this.candidate.trim().length > 0;
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
      return this.$store.state.activeChainId;
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

<style scoped>
.current-value-label {
  font-weight: 500;
}
</style>
