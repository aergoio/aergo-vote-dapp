<template>
  <router-link
    class="item-container"
    :to="`/gov_voting/${encodeURIComponent(hash)}`"
  >
    <div class="item-head">
      <p class="title grey">{{ category.toUpperCase() }}</p>
      <div class="item-tag">
        <span :class="curStatus">{{ curStatus }}</span>
        <span v-if="leftTime">{{ leftTime }}</span>
      </div>
    </div>
    <div class="item-body">
      <div class="item-content">
        <p class="text">
          <b># AIP-{{ aip }}</b
          ><br />
          <span class="grey text">{{
            title.length > 100 ? title.substring(0, 100) + '...' : title
          }}</span>
        </p>
      </div>
      <VoteGraph :yes="confirm" :no="reject" />
    </div>
  </router-link>
</template>

<script>
import { VoteGraph } from '../VoteGraph';

export default {
  name: 'VoteCardWrapper',
  components: {
    VoteGraph
  },
  props: {
    hash: {},
    aip: {},
    title: {},
    url: {},
    category: {
      type: String,
      default: '..'
    },
    confirm: {},
    reject: {},
    status: {},
    start: {},
    end: {},
    curStatus: {},
    leftTime: {}
  }
};
</script>

<style scoped lang="scss">
.grey {
  color: #656565;
}

.item-container {
  display: flex;
  flex-flow: column;
  height: 100%;

  .item-head {
    padding: 1em;
    display: flex;
    justify-content: space-between;

    .item-tag {
      span {
        font-size: 0.8em;
        background-color: cadetblue;
        padding: 0.1em 0.3em;
        border-radius: 3px;
        color: white;

        & + span {
          margin-left: 0.2em;
        }
      }
      .open {
        background-color: mediumseagreen;
      }

      .finished {
        background-color: mediumseagreen;
      }

      .closed {
        background-color: gray;
      }

      .register {
        background-color: gray;
      }
    }
  }

  .item-body {
    display: flex;
    flex-flow: column;
    height: 100%;
    padding: 1em;
    margin-top: -32px;
    z-index: 1;

    .item-content {
      flex: 1;
      word-break: break-all;
    }
  }
}
</style>
