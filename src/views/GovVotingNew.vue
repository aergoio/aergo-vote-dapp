<template>
  <div>
    <Vertical base="fill">
      <ViewTitle><p style="float:left">Gorvernanace Voting</p></ViewTitle>
      <Island>
          <button type="button" @click="onClickBack()" class="component button button-primary button-uppercase">BACK</button>
      </Island>

      <Island>
        <IslandHeader title="New Proposal" />
        <KVTable>
          <KVTableRow label="Github Agora Proposals URL"><Input size="small" placeholder="URL" /></KVTableRow>
          <KVTableRow label="Start Date / End Date"><Input size="small" placeholder="Start date" /><Input size="small" placeholder="End date" /></KVTableRow>
          <KVTableRow label="Category">
            <select name="category">
                <option value="" selected="selected">Category</option>
                <option value="Argus">Argus</option>
                <option value="Dodona">Dodona</option>
                <option value="Agora">Agora</option>
            </select>
          </KVTableRow>
          <KVTableRow label="">
            <button type="button" class="component button button-primary button-uppercase">Submit</button>
          </KVTableRow>
       </KVTable>
      </Island>
    </Vertical>
  </div>
</template>

<script>
import { ViewTitle, Alert } from '@aergoenterprise/lib-components/src/basic';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import { KVTable, KVTableRow } from '@aergoenterprise/lib-components/src/composite/tables';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';
import { Input, SelectInput } from '@aergoenterprise/lib-components/src/composite/forms';
import { Amount } from '@herajs/client';
import agora_json from '../agora.json';

export default {
  components: {
    Vertical,
    Island, IslandHeader, 
    ViewTitle,
    Button,
    Input, SelectInput,
    Alert,
    KVTable, KVTableRow,
  },
  name: 'gov-voting-new',
  props: ['id'],
  methods: {
    onClickBack() {
        this.$router.push({name:"GovernanceVoting"});
    },
  },
  computed: {
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

</style>
