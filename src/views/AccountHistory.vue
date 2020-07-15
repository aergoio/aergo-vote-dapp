<template>
  <Vertical base="fill">
    <ViewTitle>Vote reward history</ViewTitle>
    <slot></slot>
    <Island>
      <IslandHeader title="Total" />

      <KVTable>
        <KVTableRow label="Address">{{ address }} <span v-if="activeChainId">({{ activeChainId.chainid.magic }})</span></KVTableRow>
        <KVTableRow label="Received rewards">{{rewardHistory ? rewardHistory.blockCount : '...'}}</KVTableRow>
        <KVTableRow label="Total reward amount" v-if="rewardHistory">{{calculateReward(rewardHistory.blockCount) | formatToken}}</KVTableRow>
        <KVTableRow label="Most recent reward" v-if="lastRewardBlock">Block No. <a :href="lastRewardBlockUrl" target="_blank">{{lastRewardBlock.meta.no}}</a> ({{formatDistance(new Date(), new Date(lastRewardBlock.meta.ts))}} ago)</KVTableRow>
      </KVTable>
    </Island>

    <Island>
      <IslandHeader title="Last 30 days" />
      <RewardHistoryTable :address="address" @loaded="dataLoaded" />
    </Island>

  </Vertical>
</template>
<script>
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import ViewTitle from '../components/ViewTitle';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import { KVTable, KVTableRow } from '@aergoenterprise/lib-components/src/composite/tables';
import { mapState } from 'vuex';
import JSBI from 'jsbi';
import { Amount } from '@herajs/client';
import { formatDistance } from 'date-fns'
import RewardHistoryTable from '../components/RewardHistoryTable';
import { chains } from '../config.json';

export default {
  props: ['address'],
  components: {
    Island,
    IslandHeader,
    ViewTitle,
    Vertical,
    KVTable, KVTableRow,
    RewardHistoryTable,
  },
  data() {
    return {
      rewardHistory: null,
      lastRewardBlock: null,
    };
  },
  mounted() {
    this.loadLastRewardBlock();
  },
  watch: {
    '$route' (to) {
      this.loadLastRewardBlock();
    },
    'activeChainId'() {
      this.loadLastRewardBlock();
    }
  },
  computed: {
    ...mapState(['activeChainId', 'activeAccount']),
    lastRewardBlockUrl() {
      if (!this.lastRewardBlock || !this.activeChainId) return '';
      const chainConfig = chains[this.activeChainId.chainid.magic];
      if (!chainConfig) return '';
      return `${chainConfig.explorer_url}/block/${this.lastRewardBlock.hash}`;
    },
  },
  methods: {
    dataLoaded(result) {
      this.rewardHistory = result;
    },
    calculateReward(count) {
      return new Amount('0.16 aergo').mul(count);
    },
    async loadLastRewardBlock() {
      if (!this.activeChainId) return;
      const chainConfig = chains[this.activeChainId.chainid.magic];
      if (!chainConfig) return;
      const apiHost = chainConfig.api_endpoint;
      const url = `${apiHost}/blocks?q=reward_account:${this.address}&size=1&sort=no:desc`;
      const result = await(await fetch(url)).json();
      if (result && result.hits.length) {
        this.lastRewardBlock = result.hits[0];
      }
    },
    formatDistance,
  },
}
</script>