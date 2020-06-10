<template>
  <Vertical base="fill">
    <ViewTitle>Gorvernanace Voting</ViewTitle>

<!--    <Island>-->
<!--      <IslandHeader title="New Proposal"/>-->
      <KVTable>
        <KVTableRow label="Github Agora Proposals URL"><Input size="small" placeholder="URL"/></KVTableRow>
        <KVTableRow label="Start Date / End Date">
          <DatePicker mode="range"
                      :columns="2"
                      :value="datepicker_value"
                      :placeholder="'start'"
                      :masks="mask"
                      :input-props='{ placeholder: "Stat Date  -  End Date", readonly: true}' />
        </KVTableRow>
        <KVTableRow label="Category">
          <SelectInput
                  placeholder="Category"
                  :options="vote_category"
                  v-model="category_selected"></SelectInput>
        </KVTableRow>
      </KVTable>
<!--    </Island>-->
    <div class="button-wrapper">
      <Button type="button" @click="onClickBack()" class="component button button-uppercase">BACK
      </Button>
      <Button type="button" class="component button button-primary button-uppercase">Submit</Button>
    </div>
  </Vertical>
</template>

<script>
    import {ViewTitle, Alert} from '@aergoenterprise/lib-components/src/basic';
    import {Vertical} from '@aergoenterprise/lib-components/src/layout';
    import {Island, IslandHeader} from '@aergoenterprise/lib-components/src/composite';
    import {KVTable, KVTableRow} from '@aergoenterprise/lib-components/src/composite/tables';
    import {Button} from '@aergoenterprise/lib-components/src/composite/buttons';
    import {Input, SelectInput} from '@aergoenterprise/lib-components/src/composite/forms';
    import DatePicker from 'v-calendar/lib/components/date-picker.umd'



    export default {
        components: {
            Vertical,
            Island, IslandHeader,
            ViewTitle,
            DatePicker,
            Button,
            Input, SelectInput,
            Alert,
            KVTable, KVTableRow,
        },
        name: 'gov-voting-new',
        props: {
            vote_category: {
                type: Array,
                default: () => [

                    {
                        label: "Category",
                        value: "all"
                    },
                    {
                        label: "Argus",
                        value: "argus"
                    },
                    {
                        label: 'Dodona',
                        value: 'dodona',
                    },
                    {
                        label: 'Agora',
                        value: 'agora',

                    },

                ]
            },
            id:{
                type:String
            }
        },
        methods: {
            onClickBack() {
                this.$router.push({name: "GovernanceVoting"});
            },
        },
        data(){
            return {
                category_selected: 'all',
                datepicker_value:null,
                mask: {
                    input: "YYYY-MM-DD"
                }
            }
        },
        computed: {}
    }
</script>

<style scoped lang="scss">
  .current-value-label {
    font-weight: 500;
  }

  .candidate-input {
    margin: 20px 0;
  }

  .island p:last-child {
    margin-bottom: 0;
  }
  .button-wrapper{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .key-value-table{
    background-color: white;
    padding: 1em;
    dd{
      border: none;
    }
  }

</style>
