<template>
  <Vertical base="fill">
    <ViewTitle>Adjust stake</ViewTitle>

    <Island>
      <IslandHeader title="Current status" />

      <KVTable>
        <KVTableRow label="Address">{{ address }} <span v-if="activeChainId">({{ activeChainId.chainid.magic }})</span></KVTableRow>
        <KVTableRow label="Last action" v-if="when">Block no. {{when}} ({{accountLastActionTime}})</KVTableRow>
        <KVTableRow label="Next action available" v-if="when">
          <span v-if="nextActionAvailable">now</span>
          <span v-else>Block no. {{when + (60*60*24)}} (in {{nextActionRelativeString}})</span>
        </KVTableRow>
      </KVTable>
    </Island>

    <Island>
      <IslandHeader title="Adjust stake" />

      <div v-if="!activeAccount">
        <LoginWithAergoConnect @click.native="connectAccount" />
      </div>
      <div v-else>

        <KVTable>
          <KVTableRow label="Total balance" v-if="accountDetail">{{ currentTotalBalance.toUnit('aergo').toString() }}</KVTableRow>
          <KVTableRow label="Stake before change" v-if="accountDetail">{{ accountDetail.staked.toUnit('aergo').toString() }}</KVTableRow>
          <KVTableRow label="Stake after change" v-if="accountDetail">
            <div class="amount-unit-input">
              <Input v-model="stakeAmount" size="small" /> aergo
              <span v-if="stakedTooMuch" class="error"><Icon name="danger-circle" :size="18" /> Can't stake more than total balance.</span>
              <span v-if="stakedTooLittle" class="error"><Icon name="danger-circle" :size="18" /> The minimum staking amount is {{this.activeChainId.stakingminimum | formatToken}}.</span>
            </div>
          </KVTableRow>
          <KVTableRow label="Unstaked balance" v-if="accountDetail">{{ unstakedBalance.toUnit('aergo').toString() }}</KVTableRow>
          <KVTableRow label="Change from current" v-if="accountDetail">
            <div class="amount-unit-input">
              <span>{{stakeChangeAmountSign}}{{ stakeChangeAmount.toUnit('aergo').toString() }}</span>
              <Button type="primary" :disabled="!nextActionAvailable || stakeChangeAmount.equal(0)" @click="requestStakeChange">Change stake</Button>
              <span v-if="!nextActionAvailable" class="error"><Icon name="danger-circle" :size="18" /> You need to wait for {{nextActionRelativeString}} before adjusting your stake.</span>
            </div>
          </KVTableRow>
        </KVTable>

        <Alert :type="message.type" v-if="message.text">{{message.text}}</Alert>

      </div>
    </Island>

    <Island>
      <IslandHeader title="Possible voting reward" />
      <RewardCalc basis="stake" :totalVotes="activeChainId.stakingtotal" :accountVotes="stakeAmountAsAmount" :dailyTotalAmount="dailyReward" v-if="activeChainId" updating />
    </Island>
  </Vertical>
</template>
<script>
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { ViewTitle, Alert, Icon } from '@aergoenterprise/lib-components/src/basic';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import VoteHistoryTable from '../components/VoteHistoryTable.vue';
import { KVTable, KVTableRow } from '@aergoenterprise/lib-components/src/composite/tables';
import { mapState } from "vuex"
import JSBI from 'jsbi';
import { Amount } from '@herajs/client';
import { formatDistance } from 'date-fns'
import RewardCalc from '../components/RewardCalc';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';
import { Input } from '@aergoenterprise/lib-components/src/composite/forms';
import { LoginWithAergoConnect } from '@aergoenterprise/lib-components/src/composite/buttons';

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
    Button, Input,
    Alert, Icon,
    LoginWithAergoConnect,
  },
  computed: {
    ...mapState(['activeChainId', 'activeAccount']),
    dailyReward() {
      return new Amount('0.16 aergo').mul(60*60*24);
    },
    nextActionAvailable() {
      return this.accountNextActionTime && this.accountNextActionTime < new Date();
    },
    nextActionRelativeString() {
      if (!this.accountNextActionTime) {
        return '';
      }
      return `${formatDistance(new Date(), this.accountNextActionTime)}`;
    },
    currentTotalBalance() {
      return this.accountDetail.balance.add(this.accountDetail.staked);
    },
    unstakedBalance() {
      const currentTotal = this.currentTotalBalance;
      return currentTotal.sub(this.stakeAmountAsAmount);
    },
    stakeChangeAmount() {
      return this.stakeAmountAsAmount.sub(this.accountDetail.staked);
    },
    stakeChangeAmountSign() {
      return this.stakeChangeAmount.compare(0) >= 0 ? '+' : '';
    },
    stakedTooMuch() {
      return this.currentTotalBalance.compare(this.stakeAmountAsAmount) < 0;
    },
    stakedTooLittle() {
      if (!this.activeChainId && !this.activeChainId.stakingminimum) return false;
      return this.stakeAmountAsAmount.compare(this.activeChainId.stakingminimum) < 0;
    },
    stakeAmountAsAmount() {
      return new Amount(this.stakeAmount.replace(/[^\d\.]/g, ''), 'aergo');
    },
    when() {
      if (this.accountDetail && this.accountDetail.when) {
        this.$store.dispatch('getBlock', { blockNoOrHash: this.accountDetail.when}).then((block) => {
          this.accountLastActionTime = new Date(block.header.timestamp/1000000);
          this.accountNextActionTime = new Date(block.header.timestamp/1000000 + (60*60*24*1000));
        });
        return this.accountDetail.when;
      }
      return '';
    }
  },
  methods: {
    async connectAccount () {
      const account = await this.$store.dispatch('refreshActiveAccount');
      const chainId = this.activeChainId.chainid.magic;
      if (chainId != account.chainId) {
        alert(`The selected account's chain id does not match the expected chain id ${chainId}. Please select another account.`);
        return;
      }
      if (account.address != this.address) {
        this.$router.push({name: 'staking', params: {address: account.address}});
      }
    },
    async loadAccountDetail () {
      this.accountDetail = await this.$store.dispatch('getAccountDetail', { address: this.address });
      this.stakeAmount = this.accountDetail.staked.toUnit('aergo').formatNumber();
    },
    onSendTxResult(event) {
      console.log('AERGO_SEND_TX_RESULT', event.detail);
      if ('error' in event.detail) {
        this.message = {type: 'danger', text: 'An error occurred.'};
        return;
      }
      this.message = { type: 'success', text: 'Result hash: ' + event.detail.hash };
      setTimeout(()=>{
        this.loadAccountDetail();
        this.$store.dispatch('getAergo', { url: process.env.VUE_APP_AERGO_NODE });
      }, 5000)
    },
    async requestStakeChange () {
      console.log('Requesting stake change', this.stakeChangeAmount.toString());
      let account = await this.$store.dispatch('getActiveAccount');
      const addStake = this.stakeChangeAmount.compare(0) >= 0;
      const amount = addStake ? this.stakeChangeAmount : this.stakeChangeAmount.mul(-1);
      const tx = {
        from: account.address,
        to: 'aergo.system',
        type: 1,
        amount: `${amount}`,
        payload_json: {
          Name: addStake ? 'v1stake' : 'v1unstake',
          Args: []
        },
      };
      window.addEventListener('AERGO_SEND_TX_RESULT', this.onSendTxResult, { once: true });
      window.postMessage({
        type: 'AERGO_REQUEST',
        action: 'SEND_TX',
        data: tx,
      });
    },
  },
  watch: {
    '$route' (to) {
      this.accountDetail = null;
      this.stakeAmount = '0';
      this.message = {type:'success'};
      this.accountLastActionTime = null;
      this.accountNextActionTime = null;
      this.loadAccountDetail();
    }
  },
  mounted() {
    this.loadAccountDetail();
  },
  data: () => ({
    accountDetail: null,
    stakeAmount: '0',
    accountLastActionTime: null,
    accountNextActionTime: null,
    message: {type:'success'},
  })
}
</script>

<style lang="scss" scoped>
.amount-unit-input {
  display: flex;
  align-items: center;

  > * {
    margin-right: 10px;
  }
  .error {
    margin-left: 20px;
    color: #ee4648;

    .icon {
      margin-top: -2px;
      margin-right: 5px;
    }
  }
}
</style>