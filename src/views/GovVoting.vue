<template>
  <Vertical base="fill">
    <div class="title-with-button">
      <ViewTitle>Gorvernanace Voting</ViewTitle>
      <Button @click="onClickProposal()" type="button" class="component button button-primary button-uppercase"
              v-if="!!this.activeAccount">New Proposal
      </Button>
    </div>
    <Island>
      <p>Aergo Argus : Argus...?</p>
      <p>Aergo Dodona : ??</p>
      <p>Aergo Agora : ??</p>
    </Island>
    <Island :class="'vote-menu-wrapper'">
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
    

    </Island>
    <div class="grid-container">

      <div v-for="items in results" :key="items.title" class="grid-item">

        <router-link class="item-container" :to="`/gov_voting/${items.title}`">
          <div :class="`item-head item-head-${items.status.toLowerCase()}`">
            <span class="title"># {{items.title}}</span>
            <span class="category">{{items.category}}</span>
          </div>
          <div class="item-content">
            <p class="text">{{items.contents}}</p>
          </div>
          <div class="item-votes">
            <div class="vote">
              <div class="head">
                <span>YES<small>({{items.agree}})</small></span>
                <span>3%</span>
              </div>
              <div class="vote-bar-border">
                <div class="vote-bar-yes" style="transform: scale3d(0.03, 1, 1);"></div>
              </div>
            </div>
            <div class="vote">
              <div class="head">
                <span>NO<small>({{items.oppose}})</small></span>
                <span>1%</span>
              </div>
              <div class="vote-bar-border">
                <div class="vote-bar-no" style="transform: scale3d(0.01, 1, 1);"></div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </Vertical>
</template>

<script>
    import {ViewTitle} from '@aergoenterprise/lib-components/src/basic';
    import {Vertical} from '@aergoenterprise/lib-components/src/layout';
    import {Island} from '@aergoenterprise/lib-components/src/composite';
    import {Button} from '@aergoenterprise/lib-components/src/composite/buttons';
    import {DatePicker} from "../components/DatePicker";
    import SelectInput
        from "@aergoenterprise/lib-components/src/composite/forms/SelectInput/SelectInput";

    import {mapState} from "vuex";

    const vote_category = [

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

    ];
    const vote_status = [

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

    ];
    const vote_outcome = [

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


    export default {
        components: {
            Vertical,
            SelectInput,
            Island,
            ViewTitle,
            Button,
            DatePicker,
            // Input,
            // Alert
        },
        name: 'gov-voting',
        props: {
            vote_category: {
                type: Array,
                default: vote_category
            }, vote_status: {
                type: Array,
                default: vote_status
            }, vote_outcome: {
                type: Array,
                default: vote_outcome
            },

        },
        data() {
            return {
                category_selected: 'all',
                status_selected: "all",
                outcome_selected: "all",
                picker: new Date().toISOString().substr(0, 10),
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
  /*@import "~@aergoenterprise/lib-components/src/styles/variables";*/
  .title-with-button {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;

    .button {
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

  .grid-container {
    display: grid;
    gap: 16px;
    grid-auto-flow: row;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    grid-auto-rows: 270px;
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
      box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px;

      .item {
        &-container {
          display: flex;
          flex-flow: column;
          height: 100%;
        }

        &-head {
          padding: .2rem .5rem;
          display: flex;
          justify-content: space-between;

          &-open {
            background-color: rgb(44, 198, 143);
          }

          &-closed {
            background-color: rgb(255, 105, 105);
          }

          .title {
            font-weight: 600;
          }
        }

        &-content {
          padding: .7rem;
          height: 100%;
          flex: 1;
          overflow-y: hidden;

          .text {
            line-height: 1rem;
          font-weight: normal;
          }
        }

        &-votes {
          padding: .5rem;

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
    background: rgb(241, 243, 247) none repeat scroll 0% 0%;
    border-radius: 4px;
  }

  .vote-bar-yes {
    height: 6px;
    transform-origin: 0px 0px 0px;
    background-color: rgb(44, 198, 143);
    width: 100%;
  }

  .vote-bar-no {
    height: 6px;
    transform-origin: 0px 0px 0px;
    background-color: rgb(255, 105, 105);
    width: 100%;
  }
</style>
