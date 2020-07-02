<template>
  <div :class="`vote-graph dn-${displayNumber}`">
    <div class="vote-result-text">
      <div
        class="text-wrapper yes"
        :style="{ width: `50%`, textAlign: displayNumber ? 'right' : 'left' }"
      >
        <div class="text">YES</div>
        <div v-if="displayNumber" class="number">
          <span>{{ toNumber(yes) }} Aergo</span>
        </div>
      </div>
      <div
        class="text-wrapper no"
        :style="{ width: `50%`, textAlign: displayNumber ? 'left' : 'right' }"
      >
        <div class="text">NO</div>
        <div v-if="displayNumber" class="number">
          <span>{{ toNumber(no) }} Aergo</span>
        </div>
      </div>
      <div class="remain" />
    </div>
    <div class="number-wrapper">
      <div class="percent yes">{{ calcPercent(yes) }}%</div>

      <div
        class="vote-graph-wrapper"
        :style="{ height: displayNumber ? '1.2em' : '0.8em' }"
      >
        <div class="bar yes" :style="{ width: `${calcPercent(yes)}%` }" />
        <div class="bar no" :style="{ width: `${calcPercent(no)}%` }" />
        <div class="bar remain" />
      </div>

      <div class="percent no">{{ calcPercent(no) }}%</div>
    </div>
  </div>
</template>

<script>
import JSBI from 'jsbi';

export default {
  name: 'VoteGraphWrapper',
  props: {
    yes: {},
    no: {},
    displayNumber: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    calcPercent(num) {
      const sum = JSBI.add(JSBI.BigInt(this.yes), JSBI.BigInt(this.no));
      const numVal = num.toString();
      const sumVal = sum.toString();

      if (sumVal <= 0) {
        return 0;
      }
      return Math.round((numVal / sumVal) * 100);
    },
    toNumber(num) {
      return new Intl.NumberFormat().format(Math.round(num / 1.0e18));
    }
  }
};
</script>

<style scoped lang="scss">
* {
  transition: width 0.5s ease-in-out;
}
.vote-graph {
  font-weight: normal;

  .vote-result-text {
    display: flex;

    .percent {
      font-family: 'Noto Sans KR', 'Roboto Light', 'Roboto', sans-serif;
      letter-spacing: -0.1em;
    }

    .text {
      font-size: 0.8em;
      margin: 0 0.2em;
    }
  }

  .text-wrapper {
    min-width: 1em;
    margin: 0.5em;
  }

  .yes {
    color: #197353;
  }

  .no {
    color: #805b5b;
  }

  .remain {
    flex: 1;
  }

  .number-wrapper {
    display: flex;

    .number {
      margin: 0 1em;
    }
  }

  .vote-graph-wrapper {
    width: 100%;
    display: flex;
    border-radius: 2px;
    overflow: hidden;
    background-color: darkgrey;
    margin: auto;

    .bar {
      /*height: 7px;*/
      height: 1.5em;
      display: flex;
      position: relative;
      overflow-x: visible;
      color: white;

      &.yes {
        background-color: rgb(44, 198, 143);

        span {
          position: absolute;
          left: 0;
        }
      }

      &.no {
        background-color: rgb(255, 105, 105);

        span {
          position: absolute;
          right: 0;
        }
      }
    }
  }
}

.dn-false {
  .percent {
    font-size: 1em;
    width: 3rem;
    letter-spacing: -0.1em;

    &.yes {
      margin-left: 0.2em;
      text-align: left;
    }

    &.no {
      text-align: right;
      margin-right: 0.2em;
    }
  }

  .text-wrapper {
    font-size: 1.2em;
    margin: 0.3em 0;
    font-weight: bold;
  }
}

.dn-true {
  .percent {
    font-size: 1.5em;
    /*width: 3rem;*/

    &.yes {
      text-align: left;
      margin-right: 1em;
    }

    &.no {
      text-align: right;
      margin-left: 1em;
    }
  }
}
</style>
