<template>
  <TableController
    @load="loadTableData"
    defaultSortField="blockno" :defaultSortAsc="false"
    :itemsPerPage="10"
    :items="items" :totalItems="items ? items.length : 0"
    >
    <Vertical slot-scope="{ items, totalItems, sort, page, updateSort, updatePage }" base="fill">
      <Table :isLoading="isLoading" :isEmpty="totalItems === 0" class="votes-table">
        <template #header>
          <Header sortField="" :sortAsc="false">
            <HeaderCell field="vote">Vote</HeaderCell>
            <HeaderCell field="candidates">Voted for candidate(s)</HeaderCell>
            <HeaderCell field="power">Voting power</HeaderCell>
          </Header>
        </template>
        <template #rows>
          <Row v-for="(v, index) in items" :key="index">
            <Cell field="vote">
              {{ getTextID(v) }}
            </Cell>
            <Cell field="candidates">
              <ul class="candidate-list">
                <li v-for="c in v.getCandidatesList()" :key="c">{{ c }}</li>
              </ul>
            </Cell>
            <Cell field="power">
              {{displayAmount(v)}}
            </Cell>
          </Row>
        </template>
        <template #empty>
          No candidates found.
        </template>
      </Table>
      <Pagination :totalItems="totalItems" :itemsPerPage="10" @change="updatePage" v-if="totalItems > 10" />
    </Vertical>
  </TableController>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Table, Header, HeaderCell, Row, Cell, Pagination } from '@aergoenterprise/lib-components/src/composite/tables';
import TableController from '@aergoenterprise/lib-components/src/container/TableController.vue';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { IconButton } from '@aergoenterprise/lib-components/src/composite/buttons';
import { Amount } from '@herajs/client';

export default Vue.extend({
  components: {
    Table, Header, HeaderCell, Row, Cell,
    TableController, Pagination,
    IconButton,
    Vertical,
  },
  props: {
    isLoading: Boolean,
    items: Array as PropType<any[]>,
  },
  data() {
    return {
      from: 0,
      sort: 'votes:desc',
    };
  },
  computed: {
    maxAmountLength(): number {
      // Get the length of the longest amount string
      return Math.max(...this.items.map(item => (item.getAmount() ? new Amount(item.getAmount(), 'aer').toUnit('aergo').toString() : '0 aergo').length));
    }
  },
  methods: {
    loadTableData({ sort, page }: any): void {
      this.from = page.offset;
      this.sort = `${sort.field}:${sort.asc?'asc':'desc'}`;
    },
    displayAmount(vote: any): string {
      // Pad amount with whitespace to make units line up
      try {
        return new Amount(vote.getAmount(), 'aer').toUnit('aergo').toString().padStart(this.maxAmountLength, " "); // U+2007 Figure Space
      } catch(e) {
        return ''; // old API
      }
    },
    getTextID(v: any) {
      if (v.getId() == 'voteBP') {
        return 'BP';
      }
      return v.getId();
    },
  },
});
</script>

<style lang="scss">
.component.data-table.votes-table {
  width: 100%;

  .table-header-cell {
    white-space: nowrap;
  }
  .field-vote {
    width: 20%;
  }
  .field-candidates, .field-power {
    white-space: nowrap;
    width: 40%;
  }
  .candidate-list {
    margin: 0 0 0 1.5em;
    padding: 0;
  }
}
</style>
