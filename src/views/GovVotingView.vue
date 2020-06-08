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
        </p>
        <p>
          SHA256 : {{hasing(results.url)}}
        </p>
        <p>
          🔗 : {{results.url}}
        </p>
      </div>
      <div class="result-votes">
        <div class="vote">
          <div class="head">
            <span>YES<small>({{results.agree}})</small></span>
            <span>3%</span>
          </div>
          <div class="vote-bar-border">
            <div class="vote-bar-yes" style="transform: scale3d(0.03, 1, 1);"></div>
          </div>
        </div>
        <div class="vote">
          <div class="head">
            <span>NO<small>({{results.oppose}})</small></span>
            <span>1%</span>
          </div>
          <div class="vote-bar-border">
            <div class="vote-bar-no" style="transform: scale3d(0.01, 1, 1);"></div>
          </div>
        </div>
      </div>
    </div>


    <div class="button-wrapper">
      <div v-if="results.status === 'Open'" class="vote-button-group">
        <button type="button" class="component button">YES</button>
        <button type="button" class="component button">NO</button>
      </div>
      <button type="button" @click="onClickBack()" class="component button button-primary button-uppercase">BACK
      </button>
    </div>
  </Vertical>
</template>

<script>
    import {ViewTitle} from '@aergoenterprise/lib-components/src/basic';
    import {Vertical} from '@aergoenterprise/lib-components/src/layout';
    import {Island} from '@aergoenterprise/lib-components/src/composite';
    import {Button} from '@aergoenterprise/lib-components/src/composite/buttons';
    import {Input} from '@aergoenterprise/lib-components/src/composite/forms';
    import {Amount} from '@herajs/client';
    import sha256 from 'crypto-js/sha256';
    import {mapState} from "vuex";

    export default {
        components: {
            Vertical,
            ViewTitle,
            Button,
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
            results() {
                let id = this.$route.params.id;
                return this.agora.find((items) => {
                    return items["title"] === id;
                })
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
    box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px;
    border-radius: 4px;
    overflow: hidden;
    .result-head{
      padding: .5rem;
      display: flex;
      justify-content: space-between;
      &.open{
        background-color: rgb(44, 198, 143);
      }
      &.closed{
        background-color: rgb(255, 105, 105);
      }
    }
    .result-body{
      padding: 1rem;
    }
  }


  .result-votes{
    padding: 0 1rem 1rem;

    .vote-head {
      font-size: 14px;
      display: flex;
      -moz-box-pack: justify;
      justify-content: space-between;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    .vote-bar-border {
      overflow: hidden;
      background: rgb(241, 243, 247) none repeat scroll 0% 0%;
      border-radius: 4px;

      .vote-bar-yes {
        height: 6px;
        transform-origin: 0px 0px 0px;
        background-color: rgb(44, 198, 143);
        width: 100%;
      }

      .vote-bar-no {
        height: 6px;
        transform-origin: 0px 0px 0px;
        background-color: rgb(255, 105, 105);
        width: 100%;
      }
    }
  }

  .button-wrapper{
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    *+button{
      margin-left: 10px;
    }
    .vote-button-group{
      display: flex;
    }
  }
</style>
