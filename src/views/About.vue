<template>
  <Vertical base="fill" class="vertical">
    <ViewTitle>Home</ViewTitle>
      <slot></slot>
      <Island>
        <p>Welcome to the Aergo Voting portal!</p>
        <p>This is a Dapp that allows you to view the current status of votes and submit your own votes.</p>
      </Island>
  </Vertical>
</template>
<script>
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { Island} from '@aergoenterprise/lib-components/src/composite';
import ViewTitle from '../components/ViewTitle';

export default {
  props: ['address'],
  components: {
    Island,
    ViewTitle,
    Vertical,
  },
}
</script>