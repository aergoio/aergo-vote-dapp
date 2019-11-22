<template>
  <Vertical base="fill">
    <ViewTitle>Aergo Voting</ViewTitle>

    <Island>
      <p>Welcome to the Aergo Voting portal!</p>
      <p>This is a Dapp that allows you to view the current status of votes and submit your own votes.</p>
    </Island>
  </Vertical>
</template>
<script>
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { ViewTitle } from '@aergoenterprise/lib-components/src/basic';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';

export default {
  props: ['address'],
  components: {
    Island,
    IslandHeader,
    ViewTitle,
    Vertical,
  },
}
</script>