<template>
  <Vertical base="fill">
    <Alert v-if="errorMessage" :type="errorMessage.type">{{
      errorMessage.content
    }}</Alert>
    <div class="title-with-button">
      <ViewTitle>Gorvernanace Voting</ViewTitle>
      <Button
        @click="onClickProposal()"
        type="button"
        class="component button button-primary button-uppercase"
        v-if="isCouncilor"
        >New Proposal
      </Button>
    </div>
    <div class="result-wrapper">
      <div class="result-head">
        <div class="result-head-left">
          <span class="title"># AIP-{{ detail.aip }}</span>
          <span class="category"> : {{ detail.title }}</span>
        </div>
        <span class="outcome">{{ detail.category }}</span>
      </div>
      <div class="result-body">
        <div class="text-field">
          <div class="text-box">
            <div class="text-detail-box">
              <span>SHA256</span>
              <a :href="detail.url">{{ detail.hash }}</a>
            </div>
            <div class="text-detail-box">
              <span>🔗</span>
              <a :href="detail.url.replace(/[\w\d]{30,}/gi, 'master')">{{ detail.url.replace(/[\w\d]{30,}/gi, 'master') }}</a>

            </div>
          </div>
          <div class="text-box">
            <div class="text-detail-box">
              <span>issuer</span>
              <a :href="scan_url+detail.issuer">{{ detail.issuer }}</a>
            </div>
            <div class="text-detail-box">
              <span>Start date ~ End date</span>
              <p :style="{'margin':0,'whiteSpace': 'initial'}">
                start : {{ new Date(detail.startDate * 1000).toUTCString() }}<br/>
                end : {{ new Date(detail.endDate * 1000).toUTCString() }}
              </p>
            </div>
          </div>
        </div>
        <VoteGraph :yes="detail.yes" :no="detail.no" display-number/>
      </div>
    </div>
    <div class="button-wrapper">
      <div class="vote-button-group">
        <button
          type="button"
          class="component button button-primary"
          @click="vote(true)"
          :disabled="showButton(activeAccount)"
        >
          YES
        </button>
        <button
          type="button"
          class="component button button-primary"
          @click="vote(false)"
          :disabled="showButton(activeAccount)"
        >
          NO
        </button>
      </div>
      <div class="vote-button-group">
        <button
          class="component button button-primary"
          @click="onClickFinishAgenda()"
          v-if="isCouncilor"
          :disabled="detail.status !== 'open'"
        >
          Agenda CLOSE
        </button>
        <button
          type="button"
          @click="onClickBack()"
          class="right-button component button button-uppercase"
        >
          BACK
        </button>
      </div>
    </div>
  </Vertical>
</template>

<script>
import { Alert, ViewTitle } from '@aergoenterprise/lib-components/src/basic';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';
import { mapGetters, mapState } from 'vuex';
import { VoteGraph } from '../components/VoteGraph';

export default {
  components: {
    Vertical,
    ViewTitle,
    Button,
    VoteGraph,
    Alert
  },
  name: 'gov-voting-view',
  methods: {
    onClickProposal() {
      this.$router.push({ name: 'GovernanceVotingNew' });
    },
    onClickBack() {
      this.$router.push({ name: 'GovernanceVoting' });
    },
    onClickFinishAgenda() {
      this.$store.dispatch('finishAgenda', { hash: this.detail.hash });
      this.reload();
    },
    showButton(activeAccount) {
      const temp = new Date().getTime() / 1000;
      if (!activeAccount) {
        return true;
      }
      if (new Date(this.detail.startDate * 1000) > new Date()) {
        return true;
      }
      if (new Date(this.detail.endDate * 1000) < new Date()) {
        return true;
      }
      if (this.staked.split(' ')[0] <= 0) {
        return true;
      }
      if (this.detail.status.toLowerCase() !== 'open') {
        return true;
      }
      if (
        temp > this.detail.startDate &&
        temp < this.detail.endDate &&
        this.detail.status.toLowerCase() === 'open'
      ) {
        return this.voteAlready;
      }
      return true;
    },
    async alreadyVote() {
      this.voteAlready = await this.$store.dispatch('alreadyVoted', {
        hash: !this.detail ? '' : this.detail.hash.toString()
      });
    },
    async vote(result) {
      const that = this;
      const hash = await that.$store.dispatch('fetchVote', {
        result,
        hash: that.detail.hash.toString()
      });

      if (!hash) {
        this.$store.commit('setLoading', false);
        return;
      } // user cancel

      await setTimeout(() => that.getReceipt(hash), 3000);
    },
    async getReceipt(hash) {
      this.$store.commit('setLoading', false);
      const receipt = await this.$store.dispatch('getReceipt', hash.toString());
      switch (receipt.status) {
      case 'SUCCESS':
        this.errorMessage = {
          type: 'success',
          content: `Success Voting. Transaction hash : ${hash.toString()}`
        };
        this.reload();
        return;
      case 'ERROR':
        this.errorMessage = {
          type: 'danger',
          content: receipt.result.split(/:[0-9]:/gi)[1].trim()
        };
        return;
      default:
        console.log('...');
        return;
      }
    },
    reload() {
      this.alreadyVote();
      this.$store.dispatch('getAgoraList');
      this.showButton();
    }
  },
  computed: {
    ...mapState(['activeAccount', 'agora', 'staked', 'isCouncilor']),
    ...mapGetters(['govDetail']),
    detail() {
      return this.govDetail(this.$route.params.id);
    }
  },
  created() {
    this.reload();
  },
  data() {
    return {
      errorMessage: null,
      voteAlready: false,
      councilor: false
    };
  }
};
</script>

<style scoped lang="scss">
.title-with-button {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;

  .button {
    height: fit-content;
  }
}

.result-wrapper {
  width: 100%;
  max-width: 800px;
  background-color: white;
  margin-top: 20px;
  box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px;
  border-radius: 4px;
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;

  .result-head {
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    font-size: 1.2em;
    font-weight: bold;

    &.open {
      background-color: rgb(44, 198, 143);
    }

    &.closed {
      background-color: rgb(255, 105, 105);
    }
  }

  .result-body {
    padding: 0 1rem 1rem;

    .text-field {
      display: flex;
      min-height: 30vh;

      .text-box {
        padding: 1em;
        width: 50%;
        white-space: pre-line;
        word-break: break-all;
        margin: auto;
      }
      .text-detail-box {
        padding: 1em;
        position: relative;
        background-color: #f2f2f2;
        border-radius: 3px;
        & +.text-detail-box{
          margin-top: 1em;
        }
        span {
          position: absolute;
          top: -.5em;
          text-shadow: #ffffff;
          /*background-color: white;*/
          padding: 0 .5em;
        }
      }
    }
  }
}

.button-wrapper {
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  width: 100%;
  margin-top: 1rem;

  margin-left: auto;
  margin-right: auto;

  * + button {
    margin-left: 10px;
  }

  .vote-button-group {
    display: flex;
    float: left;
  }

  .right-button {
    float: right;
  }
}
</style>
