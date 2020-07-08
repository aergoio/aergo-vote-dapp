<template>
  <div id="app" class="fill-viewport">
    <ViewWithSidebar class="fill-viewport">
      <template #sidebar>
        <router-link :to="{ name: 'about' }">
          <LogoGeneric text="Voting" :size="18" />
        </router-link>
        <SidebarMenu :items="menuItems" />
        <LoginWithAergoConnect @click.native="connectAccount" :loggedInAddress="activeAccount ? activeAccount.address : ''" />
      </template>
      <template #default>
        <Loading v-if="isLoading"/>

        <router-view>
          <Alert v-if="connectionError" type="danger"
                 :style="{'margin-bottom':'15px','width':'calc(100% - 90px)'}">{{connectionError
            }}</Alert>
        </router-view>
      </template>
    </ViewWithSidebar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { LogoGeneric, Alert } from '@aergoenterprise/lib-components/src/basic';
import { LoginWithAergoConnect } from '@aergoenterprise/lib-components/src/composite/buttons';
import { ViewWithSidebar } from '@aergoenterprise/lib-components/src/composite/templates';
import { capitalize } from '@aergoenterprise/lib-components/src/filters/capitalize';
import voteDefinitions from './votes.json';
import Loading from './components/Loading';
import {SidebarMenu} from './components/SidebarMenu/';

export default {
  name: 'App',
  components: {
    ViewWithSidebar,
    SidebarMenu,
    LogoGeneric,
    LoginWithAergoConnect,
    Alert,
    Loading
  },
  data() {
    return {
      account: null,
      isPending:this.pending
    };
  },
  computed: {
    ...mapState(['systemVotings', 'activeChainId', 'activeAccount', 'connectionError','isLoading']),
    menuItems() {
      const votes = this.systemVotings.map((item, index) => {
        return {
          id: index,
          label: voteDefinitions[item.id].label,
          routeAttrs: {
            to: { name: 'voting', params: { id: item.id } },
          },
        };
      });
      return [
        {
          id:'home',
          label: 'Home',
          routeAttrs :{
            to: {name: 'about'}
          }
        },
        {
          id: 'account',
          label: 'My Account',
          routeAttrs: {
            to: this.activeAccount ? { name: 'account', params: { address: this.activeAccount.address } } : { name: 'login' },
          },
          subItems: this.activeAccount ? [
            {
              id: 'staking',
              label: 'Adjust stake',
              routeAttrs: {
                to: { name: 'staking', params: { address: this.activeAccount.address } },
              }
            },
            {
              id: 'history',
              label: 'Reward History',
              routeAttrs: {
                to: { name: 'history', params: { address: this.activeAccount.address } },
              }
            }
          ]: undefined,
        },
        {
          id: 'votes',
          label: 'System Voting',
          routeAttrs: {
            to: { name: 'voting-overview' },
          },
          subItems: votes,
        },
        {
          id: 'faq',
          label: 'FAQ',
          routeAttrs: {
            to: { name: 'faq' },
          },
        },
        {
          id: 'gov_voting',
          label: 'Governance Voting',
          routeAttrs: {
            to: { name: 'GovernanceVoting' },
          }
        },
      ];
    },
  },
  methods: {
    async connectAccount () {
      const account = await this.$store.dispatch('refreshActiveAccount');
      const chainId = this.activeChainId.chainid.magic;
      if (chainId != account.chainId) {
        alert(`The selected account's chain id does not match the expected chain id ${chainId}. Please select another account.`);
        return;
      }
      this.account = account;
      console.log('Logged in', account);
    }
  },
  created() {
    this.$store.dispatch('getAergo', { url: process.env.VUE_APP_AERGO_NODE })
  },
}
</script>

<style lang="scss">
@import url(//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css);
*{font-family: Spoqa Han Sans,sans-serif}
:root {
  --color-primary-hue: 324;
}
.fill-viewport {
  height: 100vh;
}
.logo-generic {
  margin: 25px 32px;
}
.view-sidebar .login-with-aergo-connect {
  margin: auto 25px 30px 25px;
}
.view-with-sidebar .view-sidebar {
  flex: 1 0 240px;
  max-width: 255px;
  box-shadow: 5px 2px 8px 0 #e6e9f1;
  z-index: 1;
}
.view-with-sidebar .view-sidebar .sidebar-inner-wrap {
  width: 255px;
}
.view-content-wrap{
  padding: 0  0 0 20px !important;
}

</style>
