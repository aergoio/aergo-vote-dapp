<template>
  <TableController
    @load="loadTableData"
    :itemsPerPage="15"
    :items="pageItems" :totalItems="items ? items.length : 0"
    >
    <Vertical slot-scope="{ items, totalItems, page, updatePage }" base="fill">
      <Table :isLoading="isLoading" :isEmpty="totalItems === 0" class="votes-table">
        <template #header>
          <Header>
            <HeaderCell field="pos">Pos.</HeaderCell>
            <HeaderCell field="candidate">Candidate</HeaderCell>
            <HeaderCell field="info" v-if="hasInfo">Info</HeaderCell>
            <HeaderCell field="votes">Current votes</HeaderCell>
          </Header>
        </template>
        <template #rows>
          <Row v-for="(item, index) in items" :key="item.candidate">
            <Cell field="index">
              {{index+1}}
            </Cell>
            <Cell field="candidate">
              {{padStringRight(item.candidate, maxCandidateLength)}}
              <IconButton
                size="small" style="display: inline-block" rounded
                :type="selected.indexOf(item.candidate) !== -1 ? 'primary' : 'action'"
                :iconName="selected.indexOf(item.candidate) !== -1 ? 'selected' : 'btn-add-white'"
                @click="$emit('clickCandidate', item.candidate)" />
            </Cell>
            <Cell field="description" v-if="hasInfo">
              <a v-bind:href="item.url" target="_blank">{{item.name}}</a>
            </Cell>
            <Cell field="votes">
              {{padString(item.amount ? `${formatVoteAmount(item.amount)}` : '0 aergo', maxAmountLength)}}
            </Cell>
          </Row>
        </template>
        <template #empty>
          No candidates found.
        </template>
      </Table>
      <Pagination :totalItems="totalItems" :itemsPerPage="15" @change="updatePage" v-if="totalItems > 15" />
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
import { SortParams, PageParams } from '@aergoenterprise/lib-components/src/composite/tables/Table/Table.types';

interface Item {
  candidate: string;
  amount: Amount;
  name?: string;
  url?: string;
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
    selected: Array as PropType<string[]>,
  },
  data() {
    return {
      from: 0,
      sort: 'votes:desc',
      page: { limit: -1 } as PageParams,
    };
  },
  computed: {
    maxAmountLength(): number {
      // Get the length of the longest amount string
      return Math.max(...this.items.map(item => (item.amount ? this.formatVoteAmount(item.amount) : '0').length));
    },
    maxCandidateLength(): number {
      return Math.max(...this.items.map(item => (item.candidate || '').length));
    },
    pageItems(): Item[] {
      if (this.page.limit === -1) {
        return [...this.items];
      }
      return this.items.slice(this.page.offset, this.page.offset + this.page.limit);
    },
    hasInfo(): boolean {
      return this.items.length > 0 && this.items[0].name != null;
    },
  },
  methods: {
    formatVoteAmount(amount: Amount): string {
      return `${Math.round(Number(amount.toUnit('aergo').formatNumber()))} aergo`;
    },
    loadTableData({ sort, page }: { sort: SortParams, page: PageParams }): void {
      this.from = page.offset;
      this.sort = `${sort.field}:${sort.asc?'asc':'desc'}`;
      this.page = page;
    },
    padString(amountStr: string, max: number): string {
      // Pad amount with whitespace to make units line up
      return amountStr.padStart(max, " "); // U+2007 Figure Space
    },
    padStringRight(amountStr: string, max: number): string {
      // Pad amount with whitespace to make units line up
      return amountStr.padEnd(max, " "); // U+2007 Figure Space
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
    width: 40%;
  }
  .field-description {
    width: 20%;
  }
  .field-candidate {
    font-family: "Roboto Mono", monospace;
  }
  .component.icon-button {
    border-width: 1px;
    .icon {
      width: 12px !important;
    }
  }
}
</style>
