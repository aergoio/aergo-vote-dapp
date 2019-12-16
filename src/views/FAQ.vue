<template>
  <Vertical base="fill">
    <ViewTitle>Frequently Asked Questions</ViewTitle>

    <Island>
      <p>For a step-by-step how-to guide, please start with this article:</p>
      <a target="_blank" href="https://medium.com/aergo/guide-to-aergo-dao-voting-1936b8b44e30">
        <Button rounded style="display: inline-block">Guide to Aergo DAO Voting</Button>
      </a>
    </Island>

    <Island class="faq">
      <IslandHeader title="What are the time restrictions for staking and voting?" />
      <p>After every action (both staking and voting), you need to wait for 24 hours before being able to do the next action. The only exception is the very first time: one time, you can conduct all of the actions at once. The diagram at the bottom of this page shows an example daily schedule and how it affects your current totals.</p>

      <IslandHeader title="What is voting power?" />
      <p>When you cast a vote, it is weighed by your currently staked amount. This is called the power of your vote, or voting power.</p>

      <IslandHeader title="If I can only do one action per 24 hours, is it better to stake first or vote first?" />
      <p>If you want to change your stake, you should do that first to maximize your reward. Your votes are weighed based on your currently staked amount.</p>

      <IslandHeader title="How are rewards calculated?" />
      <p>A reward (currently 0.16 aergo) is paid out with every block (block rate: 1 second). The winner is selected randomly, with the chance depending on your total voting power in relation to everybody's voting power. Over a longer time period (e.g. 24 hours), your total received reward will be very close to the statistically expected one. In mathematical terms, your expected daily reward is (myVotePower / allVotePower) * (0.16) * (60 * 60 * 24).</p>
      
      <IslandHeader title="When should I increase my stake?" />
      <p>If you have additional aergo to stake (for example because you received some rewards), it makes sense to increase your stake and vote again to increase your chances of receiving rewards. Your chance will increase roughly by the same percentage that your voting power increased, so you can calculate if it is worth your while.</p>

      <IslandHeader title="What happens when I decrease my stake (unstake)?" />
      <p>When your stake is decreased, your voting power of your current votes is automativally adjusted. You don't need to vote again.</p>
      
      <IslandHeader title="Should I vote for the same vote more than once?" />
      <p>You only need to vote again if you increased your stake or if you changed your mind about the candidate you voted for. If your stake is unchanged, voting again has no effect on your reward.</p>

      <IslandHeader title="Should I vote for all votes?" />
      <p>Yes, your reward is based on your total voting power, which is the sum of all your current votes.</p>

      <IslandHeader title="How can I know which vote I haven't voted for yet?" />
      <p>Check the Votes overview table on your account detail page. The voting power for each vote is the same as your staked balance at the time of voting. If you increased your stake, you can tell from the difference for which votes you already voted again and which you have yet to vote for.</p>
    
      <IslandHeader title="What's an example schedule for staking and voting?" />
      <p>In this example, someone staked 10000 aergo on the first day and voted in all votes. Ten days later, they increased their stake by 5000 aergo. For the next five days, they update their votes. With every updated vote, the total voting power increases, and thus their chance to win the reward.</p>
      <img src="../assets/voting-diagram.png" class="voting-diagram">
    </Island>
  </Vertical>
</template>
<script>
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { ViewTitle } from '@aergoenterprise/lib-components/src/basic';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';

export default {
  props: ['address'],
  components: {
    Island,
    IslandHeader,
    ViewTitle,
    Vertical,
    Button,
  },
}
</script>

<style lang="scss">
.voting-diagram {
  border: 1px solid #eee;
  margin-bottom: 1em;
  width: 100%;
  max-width: 150vh;
}
p + .island-header {
  margin-top: 40px;
}
.faq {
  counter-reset: section;
  .island-title:before {
    counter-increment: section;
    content: counter(section) ". ";
  }
}
</style>