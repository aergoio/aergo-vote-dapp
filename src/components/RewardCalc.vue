<template>
  <div class="reward-calculator">
    <span class="row">
      <span class="labelled-amount">
        <span class="amount-label">My {{basis}}</span>
        <span class="amount" :class="{updating}">{{accountVotes | formatToken}}</span>
      </span>

      <span>÷</span>
      
      <span class="labelled-amount">
        <span class="amount-label">Total {{basis}}</span>
        <span class="amount">{{totalVotes | formatToken}}</span>
      </span>

      <span>=</span>

      <span class="labelled-amount">
        <span class="amount-label">Reward rate</span>
        <span class="amount" :class="{updating}">{{ratioLabel}}</span>
      </span>
      
    </span>

    <span class="labelled-amount">
      <span class="amount-label">Expected daily reward</span>
      <span class="amount" :class="{updating}">~ {{expectedReward | formatToken}}</span>
    </span>

    <div v-if="basis === 'stake'" class="note" style="margin-top: 15px">
      (if all users vote with all their stake)
    </div>
    
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Amount } from '@herajs/client';
import JSBI from 'jsbi';

function aerRatio(a: Amount, b: Amount): number {
  // Devide BigInt by 10^18, convert to float, calculate ratio
  const aAergo = JSBI.toNumber(a.div(1e18).value as JSBI);
  const bAergo = JSBI.toNumber(b.div(1e18).value as JSBI);
  const ratio = aAergo / bAergo;
  return ratio;
}

export default Vue.extend({
  props: {
    totalVotes: Object as PropType<Amount>,
    accountVotes: Object as PropType<Amount>,
    dailyTotalAmount: Object as PropType<Amount>,
    updating: Boolean,
    basis: {
      type: String,
      default: 'votes',
    },
  },
  computed: {
    ratio(): number {
      return aerRatio(this.accountVotes, this.totalVotes);
    },
    ratioLabel(): string {
      const ratio = this.ratio;
      if (ratio < 0.000001 && this.accountVotes.compare(0) > 0) {
        return '<0.0001%';
      }
      return `${Math.round(ratio * 100 * 10000)/10000}%`; // precision = 4
    },
    expectedReward(): Amount {
      const aAergo = JSBI.toNumber(this.dailyTotalAmount.div(1e18).value as JSBI);
      return new Amount(Math.round(aAergo * this.ratio), 'aergo');
    },
  },
});
</script>

<style lang="scss">
.reward-calculator {
  .row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    > * {
      margin-right: 25px;
    }
  }
}

.labelled-amount {
  display: flex;
  flex-direction: column;

  .amount-label {
    color: rgba(34, 34, 34, 0.65);
    font-size: 0.9285714286em;
    line-height: 1.7;
    font-weight: 500;
  }
  .amount {
    font-size: 1.2em;

    &.updating {
      color: green;
    }
  }
}
</style>