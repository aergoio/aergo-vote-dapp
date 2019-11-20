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
          <Header sortField="votes" :sortAsc="false" @updateSort="updateSort">
            <HeaderCell field="pos">Pos.</HeaderCell>
            <HeaderCell field="candidate">Candidate</HeaderCell>
            <HeaderCell field="votes">Current votes</HeaderCell>
          </Header>
        </template>
        <template #rows>
          <Row v-for="(item, index) in items" :key="item.candidate">
            <Cell field="index">
              {{index+1}}
            </Cell>
            <Cell field="candidate">
              {{item.candidate}}
              <IconButton type="action" size="small" style="display: inline-block" rounded iconName="btn-add-white" @click="$emit('clickCandidate', item.candidate)" />
            </Cell>
            <Cell field="votes">
              {{padAmount(item.amount ? item.amount.toUnit('aergo').toString() : '0 aergo')}}
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

interface Item {
  amount: Amount;
  candidate: string;
}

export default Vue.extend({
  components: {
    Table, Header, HeaderCell, Row, Cell,
    TableController, Pagination,
    IconButton,
    Vertical,
  },
  props: {
    isLoading: Boolean,
    items: Array as PropType<Item[]>,
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
      return Math.max(...this.items.map(item => (item.amount ? item.amount.toUnit('aergo').toString() : '0 aergo').length));
    }
  },
  methods: {
    loadTableData({ sort, page }: any): void {
      this.from = page.offset;
      this.sort = `${sort.field}:${sort.asc?'asc':'desc'}`;
    },
    padAmount(amountStr: string): string {
      // Pad amount with whitespace to make units line up
      return amountStr.padStart(this.maxAmountLength, " "); // U+2007 Figure Space
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
  .field-pos {
    width: 1%;
  }
  .field-candidate, .field-votes {
    white-space: nowrap;
    width: 50%;
  }
}
</style>
