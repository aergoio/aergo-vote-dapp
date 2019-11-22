<template>
  <Vertical base="fill">
    <ViewTitle>My Account</ViewTitle>

    <Island>
      <IslandHeader title="Details" />

      <KVTable>
        <KVTableRow label="Address">{{ address }} <span v-if="activeChainId">({{ activeChainId.chainid.magic }})</span></KVTableRow>
        <KVTableRow label="Staked balance" v-if="accountDetail">
          {{ accountDetail.staked.toUnit('aergo').toString() }} ({{chance}} of all stakes)
          <span v-if="accountDetail.staked.equal(0)" class="note">You need to stake (e.g. in Aergo Connect) to be able to vote.</span>
        </KVTableRow>
        <KVTableRow label="Unstaked balance" v-if="accountDetail">{{ accountDetail.balance.toUnit('aergo').toString() }}</KVTableRow>
        <KVTableRow label="Last staking" v-if="when">Block no. {{when}} ({{accountLastActionTime}})</KVTableRow>
        <KVTableRow label="Next staking available" v-if="when">Block no. {{when + (60*60*24)}} (approx. {{accountNextActionTime}})</KVTableRow>
      </KVTable>
    </Island>

    <Island v-if="voteHistory">
      <IslandHeader title="My votes" :annotation="`Total ${totalVotingPower}`" />
      <div v-if="when">
        <VoteHistoryTable :items="voteHistory.getVotingList()" />
      </div>
      <div v-else>
        No recorded actions.
      </div>
    </Island>
  </Vertical>
</template>
<script>
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { ViewTitle } from '@aergoenterprise/lib-components/src/basic';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import VoteHistoryTable from './VoteHistoryTable.vue';
import { KVTable, KVTableRow } from '@aergoenterprise/lib-components/src/composite/tables';
import { mapState } from "vuex"
import JSBI from 'jsbi';
import { Amount } from '@herajs/client';

export default {
  props: ['address'],
  components: {
    Island,
    IslandHeader,
    ViewTitle,
    Vertical,
    VoteHistoryTable,
    KVTable, KVTableRow,
  },
  computed: {
    ...mapState(['activeChainId']),
    totalVotingPower() {
      return this.voteHistory.getVotingList().map(vote => 
        new Amount(vote.getAmount(), 'aer')
      ).reduce((a, b) => a.add(b), new Amount(0));
    },
    chance () {
      if (this.accountDetail && this.activeChainId) {
        // Devide BigInt by 10^18, convert to float, calculate ratio
        const staked = JSBI.toNumber(this.accountDetail.staked.div(1e18).value);
        const total = JSBI.toNumber(this.activeChainId.stakingtotal.div(1e18).value);
        const ratio = staked / total;
        if (ratio < 0.000001 && staked > 0) {
          return '<0.0001%';
        }
        return `${Math.round(ratio * 100 * 10000)/10000}%`; // precision = 4
      }
      return '...'
    },
    when: {
      get () {
        if (this.accountDetail) {
          this.$store.dispatch('getBlock', { blockNoOrHash: this.accountDetail.when}).then((block) => {
            this.accountLastActionTime = new Date(block.header.timestamp/1000000);
            this.accountNextActionTime = new Date(block.header.timestamp/1000000 + (60*60*24*1000));
          });
          return this.accountDetail.when;
        }
        return '...';
      },
      set (v) {
        this.$store.commit('setWhen', v)
      }
    }
  },
  methods: {
    async loadAccountVotes () {
      this.voteHistory = await this.$store.dispatch('getAccountVotes', { address: this.address });
    },
    async loadAccountDetail () {
      this.accountDetail = await this.$store.dispatch('getAccountDetail', { address: this.address });
    },
  },
  watch: {
    '$route' (to) {
      this.votingPanel = [];
      this.accountDetail = null;
      this.accountLastActionTime = null;
      this.accountNextActionTime = null;
      this.voteHistory = null;
      this.loadAccountVotes()
      this.loadAccountDetail();
    }
  },
  mounted() {
    this.loadAccountVotes()
    this.loadAccountDetail();
  },
  data: () => ({
    votingPanel: [],
    accountDetail : null,
    accountLastActionTime: null,
    accountNextActionTime: null,
    voteHistory: null
  })
}
</script>
<style lang="scss">
.note {
  color: #888;
}
</style>