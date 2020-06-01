<template>
  <div>
    <Vertical base="fill">
      <ViewTitle><p style="float:left">Gorvernanace Voting</p> <p style="float:right;font-size:small"><button @click="onClickProposal()" type="button" class="component button button-primary button-uppercase">New Proposal</button></p></ViewTitle>
      <Island>
          <button type="button" @click="onClickBack()" class="component button button-primary button-uppercase">BACK</button>
      </Island>

      <Island>
        <!--
        <Badge type="success" rounded outline><Icon name="alert" :size="16" :badgeText="unreadNotificationsCount" />asdsadsa</Badge>
        -->
        
        <div v-for="items in results" v-bind:key="items.title">
            <div class="item-head">
                <span style="font-weight: 600">{{items.category}}</span>
                <span> (Status: {{items.status}})</span>
                <span> (Outcome: {{items.outcome}})</span>
            </div>
            <div class="item-content">
                <h5># {{items.title}} : <span style="font-weight:normal">{{items.contents}}</span></h5>
                <h5>Link : <span style="font-weight:normal"><a v-bind:href="items.url">{{items.url}}</a></span></h5>
                <h5>(SHA256 : <span style="font-weight:normal">{{hasing(items.url)}}</span>)</h5>
                <div class="vote-head">
                    <span>YES ({{items.agree}})</span>
                    <span>3%</span>
                </div>
                <div class="vote-bar-border">
                    <div class="vote-bar-yes" style="transform: scale3d(0.03, 1, 1);"></div>
                </div>
                <div class="vote-head">
                    <span>NO ({{items.oppose}})</span>
                    <span>1%</span>
                </div>
                <div class="vote-bar-border">
                    <div class="vote-bar-no" style="transform: scale3d(0.01, 1, 1);"></div>
                </div>
                <div v-if="items.status === 'Open'" class="vote-button-group">
                    <button type="button" class="component button">YES</button>
                    <button type="button" class="component button">NO</button>
                </div>
            </div>
        </div>
      </Island>
    </Vertical>
  </div>
</template>

<script>
import { Icon, Badge, ViewTitle, Alert } from '@aergoenterprise/lib-components/src/basic';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';
import { Input } from '@aergoenterprise/lib-components/src/composite/forms';
import { Amount } from '@herajs/client';
import agora_json from '../agora.json';
import sha256 from 'crypto-js/sha256';

export default {
  components: {
    Vertical,
    Island, IslandHeader, 
    ViewTitle,
    Button,
    Input,
    Alert,
    Icon, Badge
  },
  name: 'gov-voting-view',
  props: ['id'],
  methods: {
    onClickProposal() {
      this.$router.push({name:"GovernanceVotingNew"});
    },
    onClickBack() {
        this.$router.push({name:"GovernanceVoting"});
    },
    hasing(message) {
        return sha256(message);
    }

  },
  computed: {
    results() {
      let id = this.$route.params.id;
      return agora_json.votes.filter((items) => {
        return items["title"] === id;
      })
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

.grid-container {
    display: grid;
    gap: 16px;
    grid-auto-flow: row;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    grid-auto-rows: 270px;
    -moz-box-align: start;
    align-items: start;
    padding: 0px 0px 24px;
    margin: 0px auto;
}
.grid-item {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgb(255, 255, 255) none repeat scroll 0% 0%;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border: 0px none;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px;
    transition-property: transform, box-shadow;
    transition-duration: 50ms;
    transition-timing-function: ease-in-out;
    text-align: left;
    white-space: normal;
}
.item-container {
    grid-template-columns: 100%;
    grid-template-rows: auto 1fr auto auto;
    gap: 8px;
    padding: 24px;
}

.item-head {
    margin-bottom: 8px;
}

.item-content {
    overflow: hidden;
    font-size: 18px;
    font-weight: 400;
    -moz-box-orient: vertical;
    -webkit-line-clamp: 3;
    hyphens: auto;
    overflow-wrap: anywhere;
    word-break: break-word;
}
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
}

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
.vote-button-group {
    display: flex;
    margin-top: 20px;
}
.vote-button-group button {
    margin-left: 10px;
}
</style>
