<template>
  <Vertical base="fill">
    <ViewTitle>
      <div class="title-with-button">
        <span>Governance Voting</span>
        <Button
          @click="onClickProposal()"
          :class="'button button-primary button-uppercase'"
          v-if="isCouncilor"
          >New Proposal
        </Button>
      </div>
    </ViewTitle>
    <Alert type="success" :style="{'margin-bottom':'15px'}" v-if="query.tx"
      >{{ 'success! : ' }}
      <a :href="scan_url + query.tx">{{ query.tx }}</a>
    </Alert>
    <slot></slot>
    <Island>
      <p>Aergo Argus : Argus...?</p>
      <p>Aergo Dodona : ??</p>
      <p>Aergo Agora : ??</p>
    </Island>
    <Island>
      <Horizontal :align="'start'">
        <SelectInput
          placeholder="Category"
          :options="vote_category"
          v-model="category_selected"
        ></SelectInput>
        <SelectInput
          placeholder="Status"
          :options="status"
          v-model="status_selected"
        ></SelectInput>
        <DatePicker
          mode="range"
          :columns="2"
          v-model="datepicker_range"
          :placeholder="'start'"
          :masks="mask"
          :input-props="{
            class: 'temp',
            placeholder: 'Start Date  -  End Date',
            readonly: true
          }"
          :popover="{ visibility: 'click' }"
        />
        <span @click="reload" class="reload" ref="refresh">
          <Icon name="refresh-dark" :size="40" :badge="false" />
        </span>
      </Horizontal>
    </Island>
    <div
      v-for="list in agoraList(
        category_selected,
        status_selected,
        datepicker_range || { start: null, end: null }
      )"
      :key="list.title"
    >
      <div class="grid-title">
        <span class="name">{{ list.title }}</span>
        <span class="number">{{ list.data.length }}</span>
      </div>
      <div class="grid-container">
        <div v-for="items in list.data" :key="items.aip" class="grid-item">
          <VoteCard
            :hash="items.hash"
            :aip="items.aip"
            :url="items.url"
            :category="items.category"
            :status="items.status"
            :confirm="items.yes"
            :reject="items.no"
            :title="items.title"
            :start="items.startDate"
            :end="items.endDate"
            :curStatus="items.curStatus"
            :leftTime="items.leftTime"
          />
        </div>
      </div>
    </div>
  </Vertical>
</template>

<script>
import { Alert } from '@aergoenterprise/lib-components/src/basic';
import ViewTitle from '../components/ViewTitle';
import {
  Vertical,
  Horizontal
} from '@aergoenterprise/lib-components/src/layout';
import { Island } from '@aergoenterprise/lib-components/src/composite';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import { VoteCard } from '../components/VoteCard';

import SelectInput from '@aergoenterprise/lib-components/src/composite/forms/SelectInput/SelectInput';

import { mapGetters, mapState } from 'vuex';
import { Icon } from '@aergoenterprise/lib-components/src/basic/index';

export default {
  components: {
    Vertical,
    SelectInput,
    Island,
    ViewTitle,
    Button,
    Horizontal,
    VoteCard,
    Alert,
    DatePicker,
    Icon
  },
  name: 'gov-voting',
  props: {
    vote_category: {
      type: Array,
      default: () => [
        {
          label: 'Category',
          value: 'all'
        },
        {
          label: 'ARGUS',
          value: 'argus'
        },
        {
          label: 'DODONA',
          value: 'dodona'
        },
        {
          label: 'AGORA',
          value: 'agora'
        }
      ]
    }
  },
  data() {
    return {
      category_selected: 'all',
      status_selected: 'all',
      datepicker_range: {
        start: null,
        end: null
      },
      mask: {
        input: 'YYYY-MM-DD'
      },
      scan_url: process.env.VUE_APP_SCAN_URL+'/transaction/'
    };
  },
  methods: {
    onClickProposal() {
      this.$router.push({ name: 'GovernanceVotingNew' });
    },
    reload(e) {
      if(e){
        e.target.style.transformOrigin = 'center'
        e.target.animate([
          {transform: 'rotateZ(0deg)'},
          {transform: 'rotateZ(360deg)'}], {
          duration: 1000,
          iterations: 3
        })
      }
      this.$store.dispatch('getAgoraList');
      this.category_selected = 'all';
      this.status_selected = 'all';
      this.datepicker_range = {
        start: null,
        end: null
      };
    }
  },
  computed: {
    ...mapState(['activeAccount', 'agora', 'status', 'isCouncilor']),
    ...mapGetters(['agoraList']),
    query() {
      return this.$route.query;
    }
  },
  created() {
    this.reload();
  }
};
</script>

<style scoped lang="scss">
.title-with-button {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .button {
    font-size: 1rem;
    height: fit-content;
  }
}
.button-normal {
  color: white;
}

.horizontal {
  > * {
    height: 40px;

    + * {
      margin-left: 10px;
    }
  }
}

.grid-title {
  margin: 20px 0;

  span + span {
    margin-left: 5px;
  }

  .name {
    font-size: 1.2rem;
    font-weight: 700;
  }

  .number {
    font-size: 0.7rem;
    background-color: var(--color-primary);//#8FCFD1;
    color: white;
    padding: 0 0.5em;
    border-radius: 5px;
  }
}

.grid-container {
  display: grid;
  gap: 16px;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: 240px;
  -moz-box-align: start;
  align-items: start;

  .grid-item {
    background-color: white;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px;
  }
}

.reload {
  cursor: pointer;
  margin-left: auto;
}

.spin-click {
  animation-name: spin;
  animation-duration: 10s;
  animation-iteration-count: 1;
}

@keyframes spin {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>

<style lang="scss">
.temp {
  height: 40px;
  padding: 1em;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid #d9d9d9;
  letter-spacing: -0.01em;
  width: 13em;
}
  .button-primary{
    background-color: #2F6F72 !important
  }
</style>
