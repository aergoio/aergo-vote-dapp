<template>
  <Vertical base="fill">
    <ViewTitle>Account</ViewTitle>
    <slot></slot>
    <Island>
      <IslandHeader title="Details" />

      <KVTable>
        <KVTableRow label="Address">{{ address }} <span v-if="activeChainId">({{ activeChainId.chainid.magic }})</span></KVTableRow>
        <KVTableRow label="Staked balance" v-if="accountDetail">
          {{ accountDetail.staked.toUnit('aergo').toString() }} ({{chance}} of all stakes)
          <span v-if="accountDetail.staked.equal(0)" class="note">You need to stake (e.g. in Aergo Connect) to be able to vote.</span>
          <router-link :to="{name: 'staking'}">Adjust</router-link>
        </KVTableRow>
        <KVTableRow label="Unstaked balance" v-if="accountDetail">{{ accountDetail.balance.toUnit('aergo').toString() }}</KVTableRow>
        <KVTableRow label="Last action" v-if="when">Block no. {{when}} ({{accountLastActionTime}})</KVTableRow>
        <KVTableRow label="Next action available" v-if="when">
          <span v-if="nextActionAvailable">now</span>
          <span v-else>Block no. {{when + (60*60*24)}} ({{nextActionRelativeString}})</span>
        </KVTableRow>
      </KVTable>
    </Island>

    <Island v-if="activeChainId && !activeChainId.totalvotingpower.equal(0)">
      <IslandHeader title="Expected voting reward" />
      <RewardCalc :totalVotes="activeChainId.totalvotingpower" :accountVotes="totalVotingPower" :dailyTotalAmount="dailyReward" />
    </Island>

    <Island v-if="voteHistory">
      <IslandHeader title="Votes" :annotation="`Total ${totalVotingPower}`" />
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
import ViewTitle from '../components/ViewTitle';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import VoteHistoryTable from '../components/VoteHistoryTable.vue';
import { KVTable, KVTableRow } from '@aergoenterprise/lib-components/src/composite/tables';
import { mapState } from "vuex"
import JSBI from 'jsbi';
import { Amount } from '@herajs/client';
import { formatDistance } from 'date-fns'
import RewardCalc from '../components/RewardCalc';

export default {
  props: ['address'],
  components: {
    Island,
    IslandHeader,
    ViewTitle,
    Vertical,
    VoteHistoryTable,
    KVTable, KVTableRow,
    RewardCalc,
  },
  computed: {
    ...mapState(['activeChainId']),
    totalVotingPower() {
      try {
        return this.voteHistory.getVotingList().map(vote => 
          new Amount(vote.getAmount(), 'aer')
        ).reduce((a, b) => a.add(b), new Amount(0));
      } catch(e) {
        return new Amount(0);
      }
    },
    nextActionRelativeString() {
      if (!this.accountNextActionTime) {
        return '';
      }
      return `in ${formatDistance(new Date(), this.accountNextActionTime)}`;
    },
    nextActionAvailable() {
      return this.accountNextActionTime && this.accountNextActionTime < new Date();
    },
    dailyReward() {
      return new Amount('0.16 aergo').mul(60*60*24);
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