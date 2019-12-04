<template>
  <Rest :endpoint="endpoint" :input="restInput" :loadOnInput="true" :timed="true" @loaded="dataLoaded">
    <div slot-scope="{ status, result }">
    <TableController
      @load="loadTableData"
      defaultSortField="no" :defaultSortAsc="false"
      :itemsPerPage="restInput.size"
      :items="result ? reverse(result.blockPerDay || []) : []" :totalItems="result ? result.blockPerDay.length : 0"
      >
    <Vertical slot-scope="{ items, totalItems, sort, page, updateSort }" base="fill">
      <Table :isLoading="status === 'loading'" :isEmpty="totalItems === 0" class="reward-history-table">
        <template #header>
          <Header :sortField="sort.field" :sortAsc="sort.asc" @updateSort="updateSort">
            <HeaderCell field="ts">Timestamp</HeaderCell>
            <HeaderCell field="count">Count</HeaderCell>
            <HeaderCell field="reward_amount">Reward</HeaderCell>
          </Header>
        </template>
        <template #rows>
          <Row v-for="item in items" :key="item.hash">
            <Cell field="ts">
              {{formatTs(item.key)}}
            </Cell>
            <Cell field="count">
              {{item.doc_count}}
            </Cell>
            <Cell field="reward_amount">
              {{calculateReward(item.doc_count) | formatToken}}
            </Cell>
          </Row>
        </template>
        <template #empty>
          There are no items
        </template>
      </Table>
    </Vertical>
  </TableController>
  </div>
  </Rest>
</template>

<script lang="ts">
import Vue from 'vue';
import { Table, Header, HeaderCell, Row, Cell, Pagination } from '@aergoenterprise/lib-components/src/composite/tables';
import TableController from '@aergoenterprise/lib-components/src/container/TableController.vue';
import { LoadArgs } from '@aergoenterprise/lib-components/src/container/TableController.types';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { Rest } from '@aergoenterprise/lib-components/src/container';
import { formatDistance, format } from 'date-fns';
import { Amount } from '@herajs/client';
import { chains } from '../config.json';
import { mapState } from "vuex";

export default Vue.extend({
  components: {
    Table, Header, HeaderCell, Row, Cell,
    TableController, Pagination,
    Vertical,
    Rest,
  },
  props: {
    address: String,
  },
  data() {
    return {
      isLoading: false,
      restInput: {
        address: `${this.address}`,
        sort: 'no:desc',
        size: 20,
        from: 0,
      },
    };
  },
  computed: {
    ...mapState(['activeChainId']),
    endpoint(): string {
      if (!this.activeChainId) return '';
      const chainConfig = chains[this.activeChainId.chainid.magic as "aergo.io" | "testnet.aergo.io"];
      if (!chainConfig) return '';
      return `${chainConfig.api_endpoint}/rewards`;
    }
  },
  methods: {
    loadTableData({ sort, page }: LoadArgs): void {
      this.restInput.from = page.offset;
      this.restInput.sort = `${sort.field}:${sort.asc?'asc':'desc'}`;
    },
    dataLoaded(result: any): void {
      this.$emit('loaded', result);
    },
    formatTs(ts: string): string {
      const date = new Date(ts);
      const today = new Date();
      const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      if (isToday) return 'Today until now';
      return format(date, 'yyyy-MM-dd');
    },
    calculateReward(count: number): Amount {
      return new Amount('0.16 aergo').mul(count);
    },
    reverse(arr: any[]): any[] {
      const copy = [...arr];
      return copy.reverse();
    }
  },
});
</script>

<style lang="scss">
.reward-history-table {
  width: 100%;
  .table-header-cell {
    white-space: nowrap;
  }
  .field-blockno {
    width: 1%;
  }
  .field-blockno { font-weight: 500; }
}
</style>
