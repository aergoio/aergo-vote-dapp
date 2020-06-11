<template>
  <div class="vote-graph">
    <div class="vote-result-text">
      <div class="yes">
        <div class="percent">30%</div>
        <div class="text">YES</div>
      </div>
      <div class="no">
        <div class="percent">20%</div>
        <div class="text">NO</div>
      </div>
      <div class="remain"/>
    </div>
    <div class="vote-graph-wrapper">
      <div class="bar yes"/>
      <div class="bar no"/>
      <div class="bar remain"/>
    </div>
  </div>
</template>

<script>
    export default {
        name: "VoteGraphWrapper"
    }
</script>

<style scoped lang="scss">
  .vote-graph {
    /*padding: 0 calc(1em - 3px);*/
    font-weight: normal;

    .vote-result-text {
      display: flex;
      padding: .2em;

      .percent {
        font-family: "Noto Sans KR", "Roboto Light", "Roboto", sans-serif;
        font-size: 1.5em;
        letter-spacing: -0.1em;
      }
      .text{
        font-size: .8em;
      }
    }

    .yes {
      width: 30%;
      color: #197353;
    }

    .no {
      width: 20%;
    }

    .remain {
      flex: 1;
    }

    .vote-graph-wrapper {
      width: 100%;
      display: flex;
      border-radius: 2px;
      overflow: hidden;
      background-color: darkgrey;

      .bar {
        height: 7px;

        &.yes {
          background-color: rgb(44, 198, 143);
        }

        &.no {
          background-color: rgb(255, 105, 105);

        }
      }
    }

  }
</style>