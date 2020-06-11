<template>
  <Vertical base="fill">
    <div class="title-with-button">
      <ViewTitle>Gorvernanace Voting</ViewTitle>
      <Button @click="onClickProposal()" type="button" class="component button button-primary button-uppercase"
              v-if="!!this.activeAccount">New
        Proposal
      </Button>
    </div>
    <div class="result-wrapper">
      <div :class="`result-head ${results.status.toLowerCase()}`">
        <div class="result-head-left">
          <span class="title"># {{results.title}}</span>
          <span class="category"> : {{results.category}}</span>
        </div>
        <span class="outcome">{{results.outcome}}</span>
      </div>
      <div class="result-body">
        <p>
          {{results.contents}}
          <span>
          SHA256 : {{hasing(results.url)}}
        </span>
          <span>
          🔗 : {{results.url}}
        </span>
        </p>

        <VoteGraph/>
      </div>
    </div>

    <div class="button-wrapper">
      <div v-if="results.status === 'Open' && !!this.activeAccount" class="vote-button-group">
        <button type="button" class="component button button-primary">YES</button>
        <button type="button" class="component button button-primary">NO</button>
      </div>
      <button type="button" @click="onClickBack()"
              class="right-button component button  button-uppercase">BACK
      </button>
    </div>
  </Vertical>
</template>

<script>
    import {ViewTitle} from '@aergoenterprise/lib-components/src/basic';
    import {Vertical} from '@aergoenterprise/lib-components/src/layout';
    import {Button} from '@aergoenterprise/lib-components/src/composite/buttons';
    import sha256 from 'crypto-js/sha256';
    import {mapGetters, mapState} from "vuex";
    import {VoteGraph} from "../components/VoteGraph";

    export default {
        components: {
            Vertical,
            ViewTitle,
            Button,
            VoteGraph
        },
        name: 'gov-voting-view',
        props: {
            id: {
                type: String
            }
        },
        methods: {
            onClickProposal() {
                this.$router.push({name: "GovernanceVotingNew"});
            },
            onClickBack() {
                this.$router.push({name: "GovernanceVoting"});
            },
            hasing(message) {
                return sha256(message);
            }

        },
        computed: {
            ...mapState(['activeAccount', 'agora']),
            ...mapGetters(['govDetail']),
            results() {
                return this.$store.getters.govDetail(this.id);
            }
        }
    }
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
    background-color: white;
    margin-top: 20px;
    box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px;
    border-radius: 4px;
    overflow: hidden;

    .result-head {
      padding: .5rem;
      display: flex;
      justify-content: space-between;
      color: white;

      &.open {
        background-color: rgb(44, 198, 143);
      }

      &.closed {
        background-color: rgb(255, 105, 105);
      }
    }

    .result-body {
      padding: 0 1rem 1rem;
      white-space: pre-line;
    }
  }


  .button-wrapper {
    display: block;
    /*justify-content: space-between;*/
    margin-top: 1rem;

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
