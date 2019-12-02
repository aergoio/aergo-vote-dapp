<template>
  <div>
    <Vertical base="fill">
      <ViewTitle>Vote: {{voteLabel}} ({{id}})</ViewTitle>
      <Island>
        <p>
          <span class="current-value-label">Current value: </span> 
          <span v-if="id !== 'BP'">{{current}}</span> 
          <span v-else>candidates 1-{{$store.state.activeChainId.bpnumber}}</span>
          <span v-if="isVoteWithAmountValue"> ({{currentAsAmount | formatToken}})</span>
        </p>
        <p>{{voteDescription}}</p>
      </Island>

      <Island>
        <IslandHeader title="Candidates" />
        <VoteTable :items="votesList" :isLoading="!votesLoad" @clickCandidate="addSelected" />
      </Island>

      <Island>
        <IslandHeader title="Cast your vote" />
        <p>Select candidate(s) from above or enter manually.</p>

        <Alert :type="message.type" v-if="message.text">{{message.text}}</Alert>
      
        <FilterItems :items="selected" :removeItem="removeSelected" />

        <div class="candidate-input">
          <Input size="small" v-if="!fullSelected" v-model="candidate" placeholder="Enter candidate manually" />
        </div>

        <Button type="primary-alt" @click="addSelected(candidate); requestVote()" :disabled="!isButtonEnabled">Vote</Button>
      </Island>
    </Vertical>
  </div>
</template>

<script>
import VoteTable from '../components/VoteTable';
import { ViewTitle, Alert } from '@aergoenterprise/lib-components/src/basic';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import FilterItems from '@aergoenterprise/lib-components/src/composite/forms/Filters/FilterItems.vue';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';
import { Input } from '@aergoenterprise/lib-components/src/composite/forms';
import { Amount } from '@herajs/client';
import bpmap from '../bpmap.json'
import votes from '../votes.json';

const votesWithAmountValue = ['GASPRICE', 'NAMEPRICE', 'STAKINGMIN'];

export default {
  components: {
    Vertical,
    Island, IslandHeader, 
    ViewTitle,
    VoteTable,
    FilterItems,
    Button,
    Input,
    Alert,
  },
  name: 'system-voting',
  props: ['id'],
  methods: {
    addSelected (candidate) {
      candidate = `${candidate}`.trim();
      if (!candidate) {
        return;
      }
      if (this.fullSelected) {
        this.message = {type: 'danger', text: `Cannot select more than ${this.maxSelections} candidates`};
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
      if (!this.fullSelected) {
        this.message = {type: 'success'};
      }
    },
    onSendTxResult(event) {
      if (event.detail.hash) {
        this.message = {type: 'success', text: 'Thanks for voting! Transaction hash: ' + event.detail.hash};
      } else {
        this.message = {type: 'danger', text: 'An error occurred.'};
      }
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
      window.addEventListener('AERGO_SEND_TX_RESULT', this.onSendTxResult, { once: true })
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
          if (this.$props.id == 'BP') {
            if (bpmap[vote.candidate] != null) {
              vote.url = bpmap[vote.candidate].url
              vote.name = bpmap[vote.candidate].name
            }
            else {
              vote.url = ''
              vote.name = '?'
            }
          }
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
    isVoteWithAmountValue() {
      return votesWithAmountValue.indexOf(this.id) !== -1;
    },
    currentAsAmount() {
      return new Amount(this.current);
    },
    fullSelected () {
      return this.selected.length >= this.maxSelections
    },
    maxSelections () {
      if (this.id == 'BP') {
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
    },
    voteDescription() {
      if (!(this.id in votes)) return '';
      return votes[this.id].description;
    },
    voteLabel() {
      if (!(this.id in votes)) return '';
      return votes[this.id].label;
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
.candidate-input {
  margin: 20px 0;
}
.island p:last-child {
  margin-bottom: 0;
}
</style>
