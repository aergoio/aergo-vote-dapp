<template>
  <Vertical base="fill">
    <ViewTitle>
      <div class="title-with-button">
        <span>Gorvernanace Voting</span>
        <Button @click="onClickProposal()" :class="'button button-primary button-uppercase'"
                v-if="!!this.activeAccount">New Proposal
        </Button>
      </div>
    </ViewTitle>
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
                v-model="category_selected"></SelectInput>
        <SelectInput
                placeholder="Status"
                :options="vote_status" v-model="status_selected"></SelectInput>
        <SelectInput
                placeholder="Outcome"
                :options="vote_outcome" v-model="outcome_selected"></SelectInput>

        <DatePicker mode="range"
                    :columns="2"
                    :value="datepicker_value"
                    :placeholder="'start'"
                    :masks="mask"
                    :input-props='{
                        class:"temp",
                        placeholder: "Start Date  -  End Date",
                        readonly: true,
                    }'
                    :theme="{
                        datePickerInputDrag: { light: 'temp' }
                      }"
                    :popover="{ visibility : 'click'}"
        />
      </Horizontal>

    </Island>
    <div class="grid-container">

      <div v-for="items in results" :key="items.title" class="grid-item">

        <router-link class="item-container" :to="`/gov_voting/${items.title}`">
          <div :class="`item-head item-head-${items.status.toLowerCase()}`">
            <span class="title">{{items.category}}</span>
            <span :class="items.outcome.toLowerCase()"><div/><div/><div/></span>
          </div>
          <div class="item-content">
            <p class="text"><b># {{items.title}}</b> {{items.contents.length>80?items.contents.slice(0,80)+"..." :
              items.contents
              }}</p>
          </div>
          <VoteGraph/>
        </router-link>
      </div>
    </div>
  </Vertical>
</template>

<script>
    import {ViewTitle} from '@aergoenterprise/lib-components/src/basic';
    import {Vertical, Horizontal} from '@aergoenterprise/lib-components/src/layout';
    import {Island} from '@aergoenterprise/lib-components/src/composite';
    import {Button} from '@aergoenterprise/lib-components/src/composite/buttons';
    import DatePicker from 'v-calendar/lib/components/date-picker.umd'

    import SelectInput
        from "@aergoenterprise/lib-components/src/composite/forms/SelectInput/SelectInput";

    import {mapState} from "vuex";
    import {VoteGraph} from "../components/VoteGraph";


    export default {
        components: {
            Vertical,
            SelectInput,
            Island,
            ViewTitle,
            Button,
            DatePicker,
            Horizontal,
            VoteGraph
        },
        name: 'gov-voting',
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
            }, vote_status: {
                type: Array,
                default: () => [

                    {
                        label: 'Status',
                        value: 'all',
                    },
                    {
                        value: 'open',
                        label: 'Open',
                    },
                    {
                        value: 'closed',
                        label: 'Closed',
                    },

                ]
            }, vote_outcome: {
                type: Array,
                default: () => [

                    {
                        value: 'all',
                        label: 'Outcome',
                    },
                    {
                        value: 'passed',
                        label: "Passed"
                    },
                    {
                        value: "rejected",
                        label: "rejected"
                    },

                ]
            },

        },
        data() {
            return {
                category_selected: 'all',
                status_selected: "all",
                outcome_selected: "all",
                datepicker_value: null,
                mask: {
                    input: "YYYY-MM-DD"
                }
            }
        },
        methods: {
            onClickProposal() {
                this.$router.push({name: "GovernanceVotingNew"});
            }
        },
        computed: {
            ...mapState(['activeAccount', 'agora']),
            results() {
                const {agora, category_selected, status_selected, outcome_selected} = this;

                return agora
                    .filter(i => {
                        if (category_selected === "all"
                            || category_selected === i.category.toLowerCase()) return i
                    }).filter(i => {
                        if (status_selected === "all"
                            || status_selected === i.status.toLowerCase()) return i
                    }).filter(i => {
                        if (outcome_selected === "all"
                            || outcome_selected === i.outcome.toLowerCase()) return i
                    });
            },
        }
    }
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

  .vote-menu-wrapper {
    > * {
      height: 2rem;
      display: inline-block;

      & + * {
        margin-left: 1rem;
      }
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

  .grid-container {
    display: grid;
    gap: 16px;
    grid-auto-flow: row;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    grid-auto-rows: 240px;
    -moz-box-align: start;
    align-items: start;
    padding: 0 0 24px;
    margin-top: 20px;


    .grid-item {
      background-color: white;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      cursor: pointer;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px;

      .item {
        &-container {
          display: flex;
          flex-flow: column;
          height: calc(100% - 2em);
          padding: 1em;
        }

        &-head {
          padding: .5em;
          display: flex;
          justify-content: space-between;
          color: white;
          margin: -1em;
          margin-bottom: 1em;
          height: 1em;

          &-open {
            background-color: rgb(44, 198, 143);

          }

          &-closed {
            background-color: rgb(255, 105, 105);
          }

          .title {
            font-weight: 600;
          }

          .passed, .rejected, .pending {
            display: flex;

            div {
              width: 1em;
              height: 1em;
              background-color: white;
              border-radius: 50%;
              border: 1px solid rgba(white,.8);

              + div {
                margin-left: .2em;
              }
            }
          }
          .passed>div:first-child{
            background-color: #63c955;
          }
          .pending>div:nth-child(2){
            background-color: #f5c050;
          }
          .rejected>div:last-child{
            background-color: #eb6155;
          }
        }

        &-content {
          height: 100%;
          flex: 1;
          overflow-y: hidden;

          .text {
            line-height: 1.3rem;
            font-size: 1rem;
            font-weight: normal;
          }
        }

        &-votes {
          padding: 0 1rem;

          .vote {
            + .vote {
              margin-top: 5px;
            }

            .head {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }

  .vote-bar-border {
    overflow: hidden;
    background: rgb(241, 243, 247) none repeat scroll 0 0;
    border-radius: 4px;
  }

  .vote-bar-yes {
    height: 6px;
    transform-origin: 0 0 0;
    background-color: rgb(44, 198, 143);
    width: 100%;
  }

  .vote-bar-no {
    height: 6px;
    transform-origin: 0 0 0;
    background-color: rgb(255, 105, 105);
    width: 100%;
  }

  .outcome {
    width: 100%;
    margin-top: .5em;
    box-sizing: border-box;
    text-align: right;
    font-weight: 400;
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
</style>