<template>
  <Vertical base="fill">
    <ViewTitle>Governance Voting</ViewTitle>
    <Alert v-if="errorMessage" type="danger" :style="{'margin-bottom':'15px'}">{{ errorMessage }}</Alert>
    <slot></slot>
    <Island>
      <IslandHeader title="New Proposal" />
      <KVTable>
        <KVTableRow label="Github Agora Proposals URL">
          <span>{{ agoraUrl }}</span>

          <input
            type="text"
            placeholder="URL"
            v-model="url"
            @focus="onGetFocus"
            @blur="onGetGithubUrlData"
            @paste="onPaste"
            class="urlBox"
          />
        </KVTableRow>
        <KVTableRow label="Start Date">
          <label class="check">
            <input type="radio" name="quarter" @click="checkQuarter('03')" />
            1Q
          </label>
          <label class="check">
            <input type="radio" name="quarter" @click="checkQuarter('06')" />
            2Q
          </label>
          <label class="check">
            <input type="radio" name="quarter" @click="checkQuarter('09')" />
            3Q
          </label>
          <label class="check">
            <input type="radio" name="quarter" @click="checkQuarter('12')" />
            4Q
          </label>
          <label @click="radioButtonDisable">
            <DatePicker
              mode="single"
              ref="datePicker"
              v-model="datepicker_range"
              :placeholder="'start'"
              :masks="mask"
              :input-props="{
                class: 'temp height',
                placeholder: 'Start Date',
                readonly: true
              }"
              :popover="{ visibility: 'hover-focus' }"
            />
          </label>
        </KVTableRow>
        <KVTableRow label="data">
          <div v-if="!url"></div>
          <div class="error" v-else-if="isError">
            <span>Error : URL validation failed!</span>
          </div>
          <div v-else>
            {{ githubData }}
          </div>
        </KVTableRow>
      </KVTable>
    </Island>
    <div class="button-wrapper">
      <Button
        type="button"
        @click="onIssueAgenda()"
        class="component button button-primary button-uppercase"
        >Submit
      </Button>
      <Button
        type="button"
        @click="onClickBack()"
        class="component button button-uppercase"
        >BACK
      </Button>
    </div>
  </Vertical>
</template>

<script>
import { Alert } from '@aergoenterprise/lib-components/src/basic';
import ViewTitle from '../components/ViewTitle';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import {
  Island,
  IslandHeader
} from '@aergoenterprise/lib-components/src/composite';
import {
  KVTable,
  KVTableRow
} from '@aergoenterprise/lib-components/src/composite/tables';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';
import sha256 from 'crypto-js/sha256';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

export default {
  components: {
    Vertical,
    Island,
    IslandHeader,
    ViewTitle,
    DatePicker,
    Button,
    KVTable,
    KVTableRow,
    Alert
  },
  name: 'gov-voting-new',
  props: {
    id: {
      type: String
    }
  },
  methods: {
    radioButtonDisable() {
      document
        .querySelectorAll('input[type=radio]')
        .forEach((i) => (i.checked = false));
    },
    onClickBack() {
      this.$router.push({ name: 'GovernanceVoting' });
    },
    onGetFocus() {
      this.url = null;
      this.githubData = null;
      this.isError = false;
    },
    onPaste(e) {
      let url =
        this.url ||
        (
          e.clipboardData ||
          e.originalEvent.clipboardData ||
          window.clipboardData
        ).getData('text');
      const regex = /https:\/\/raw\.githubusercontent\.com\/aergoio\/\w+\/(?=[\d\w]{30,}\/AIP-\d+\.md)/gi;
      const regex2 = /https:\/\/github\.com\/aergoio\/agora_testcase\/blob\//gi;
      e.preventDefault();

      if (regex.test(url) || regex2.test(url)) {
        e.target.value = this.url = url.replace(regex, '').replace(regex2, '');
      } else if (/[\d\w]{30,}\/AIP-\d+\.md/gi.test(url)) {
        e.target.value = this.url = url;
      } else {
        e.target.placeholder = 'URL ERROR!';
        this.isError = true;
      }
    },
    checkQuarter(quarter) {
      this.datepicker_range = new Date(
        `${new Date().getFullYear()}-${quarter}-01`
      );
    },
    async onIssueAgenda() {
      const that = this;
      await that.validation();
      const hash = await that.$store.dispatch('fetchAgenda', that.agenda);
      await setTimeout(() => that.getReceipt(hash), 3000);
    },
    async getReceipt(hash) {
      const receipt = await this.$store.dispatch('getReceipt', hash.toString());
      this.$store.commit('setLoading', false);
      switch (receipt.status) {
      case 'SUCCESS':
        await this.$router.push(`/gov_voting?tx=${hash.toString()}`);
        return;
      case 'ERROR':
        this.errorMessage = receipt.result.split(/:[0-9]:/gi)[1].trim();
        return;
      default:
        console.log('...');
        return;
      }
    },
    async onGetGithubUrlData() {
      if (!this.url) return;

      this.isError = false;
      const that = this;
      this.githubData = await fetch(process.env.VUE_APP_AGORA_URL + this.url)
        .then((resp) => resp.text())
        .then((text) => {
          const split = text.split('---');
          that.agenda = {
            hash: sha256(text.replace(/status\s?:\s?\w+/gi, '')).toString()
          };
          return split[1];
        })
        .then((data) =>
          data
            .split('\n')
            .filter((i) => i.length > 0)
            .reduce((accm, curr) => {
              const temp = curr.split(':');
              accm[temp[0].trim().toLowerCase()] = temp[1].trim();
              return accm;
            }, {})
        )
        .catch(() => {
          this.isError = true;
        });
    },
    validation() {
      const { githubData, url, datepicker_range } = this;

      if (!githubData) {
        this.errorMessage = 'No Data';
        return;
      }
      if (!url) {
        this.errorMessage = 'No URL';
        return;
      }
      if (!datepicker_range) {
        this.errorMessage = 'No Date';
        return;
      }
      this.errorMessage = null;

      const offsetTime = new Date().getTimezoneOffset() * 60;

      this.agenda = Object.assign(this.agenda, {
        aip: githubData.aip,
        title: githubData.title,
        url: process.env.VUE_APP_AGORA_URL + url,
        category: githubData.category,
        startDate: datepicker_range.getTime() / 1000 - offsetTime + 28800,
        endDate: datepicker_range.getTime() / 1000 - offsetTime + 201599
      });
    }
  },
  data() {
    return {
      category_selected: 'all',
      datepicker_range: null,
      mask: {
        input: 'YYYY-MM-DD'
      },
      url: '',
      githubData: null,
      agenda: null,
      isError: false,
      txResult: '',
      errorMessage: null,
      agoraUrl: process.env.VUE_APP_AGORA_URL
    };
  }
};
</script>

<style scoped lang="scss">

.button-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

dl > * > * {
  height: 40px;
}

.error {
  border: solid 1px red;
  border-radius: 4px;
  background-color: rgba(red, 10%);
  box-sizing: border-box;
  display: flex;

  span {
    margin: auto;
    font-weight: bold;
    color: rgba(red, 50%);
  }
}

.check {
  margin-right: 1em;
}

.urlBox {
  width: 29em;
  height: 2em;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  padding: 0 0.5em;
}
</style>
