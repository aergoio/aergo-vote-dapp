<template>
  <div id="app" class="fill-viewport">
    <MobileWalletConnect v-if="$store.state.QRPopupOpen" />
    <ViewWithSidebar class="fill-viewport">
      <template #sidebar>
        <router-link :to="{ name: 'about' }">
          <LogoGeneric text="Portal" :size="20" />
        </router-link>
        <SidebarMenu :items="menuItems" />
        <LoginWithAergoConnect
          v-if="!$store.state.isMobile"
          @click.native="connectAccount"
          :loggedInAddress="activeAccount ? activeAccount.address : ''"
        />
        <div class="toggle-wrapper">
          <input id="isMB" type="checkbox" @change="e => clickToggle(e)" />
          <label for="isMB" />
        </div>
      </template>
      <template #default>
        <Loading v-if="isLoading" />

        <router-view>
          <Alert
            v-if="connectionError"
            type="danger"
            :style="{ 'margin-bottom': '15px', width: 'calc(100% - 90px)' }"
            >{{ connectionError }}
          </Alert>
        </router-view>
      </template>
    </ViewWithSidebar>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { LogoGeneric, Alert } from '@aergoenterprise/lib-components/src/basic';
import { ViewWithSidebar } from '@aergoenterprise/lib-components/src/composite/templates';
import voteDefinitions from './votes.json';
import Loading from './components/Loading';
import { SidebarMenu } from './components/SidebarMenu/';
import LoginWithAergoConnect from '@/components/Basic/LoginWithAergoConnect';
import MobileWalletConnect from '@/components/Basic/MobileWalletConnect';

export default {
  name: 'App',
  components: {
    MobileWalletConnect,
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
      isPending: this.pending
    };
  },
  computed: {
    ...mapState([
      'systemVotings',
      'activeChainId',
      'activeAccount',
      'connectionError',
      'isLoading'
    ]),
    menuItems() {
      const votes = this.systemVotings.map((item, index) => {
        return {
          id: index,
          label: voteDefinitions[item.id].label,
          routeAttrs: {
            to: { name: 'voting', params: { id: item.id } }
          }
        };
      });
      return [
        {
          id: 'home',
          label: 'Home',
          routeAttrs: {
            to: { name: 'about' }
          }
        },
        {
          id: 'account',
          label: 'My Account',
          routeAttrs: {
            to: this.activeAccount
              ? {
                  name: 'account',
                  params: { address: this.activeAccount.address }
                }
              : { name: 'login' }
          },
          subItems: this.activeAccount
            ? [
                {
                  id: 'staking',
                  label: 'Adjust stake',
                  routeAttrs: {
                    to: {
                      name: 'staking',
                      params: { address: this.activeAccount.address }
                    }
                  }
                },
                {
                  id: 'history',
                  label: 'Reward History',
                  routeAttrs: {
                    to: {
                      name: 'history',
                      params: { address: this.activeAccount.address }
                    }
                  }
                }
              ]
            : undefined
        },
        {
          id: 'votes',
          label: 'System Voting',
          routeAttrs: {
            to: { name: 'voting-overview' }
          },
          subItems: votes
        },
        {
          id: 'gov_voting',
          label: 'Governance Voting',
          routeAttrs: {
            to: { name: 'GovernanceVoting' }
          }
        },
        {
          id: 'faq',
          label: 'FAQ',
          routeAttrs: {
            to: { name: 'faq' }
          }
        }
      ];
    }
  },
  methods: {
    async connectAccount() {
      const account = await this.$store.dispatch('refreshActiveAccount');
      const chainId = this.activeChainId.chainid.magic;
      if (chainId != account.chainId) {
        alert(
          `The selected account's chain id does not match the expected chain id ${chainId}. Please select another account.`
        );
        return;
      }
      this.account = account;
      console.log('Logged in', account);
    },
    clickToggle(e) {
      this.$store.commit('setDevice', e.target.checked);
    }
  },
  created() {
    this.$store.dispatch('getAergo', { url: process.env.VUE_APP_AERGO_NODE });
  }
};
</script>

<style lang="scss" scoped>
.toggle-wrapper {
  height: 36px;
  box-sizing: border-box;
  position: fixed;
  right: 100px;
  top: 20px;

  label {
    z-index: 9;
    width: 30px;
    height: 30px;
    background-color: white;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 30px;
    margin: 3px;
    transform: translateX(0);
    transition: all 0.1s ease-in;
  }

  #isMB {
    margin-left: -99999px;

    &:before {
      content: '';
      width: 70px;
      height: 30px;
      border: 3px solid gray; //var(--color-primary);
      background-color: gray;
      border-radius: 30px;
      bottom: 0;
      position: absolute;
      left: 0;
      z-index: 1;
    }

    &:checked {
      &:after {
        content: '';
        width: 70px;
        height: 30px;
        border: 3px solid var(--color-primary);
        background-color: var(--color-primary);
        border-radius: 30px;
        bottom: 0;
        position: absolute;
        left: 0;
        z-index: 1;
      }

      + label {
        transform: translateX(40px);
      }
    }
  }
}
</style>

<style lang="scss">
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
  margin: auto 25px 10px;
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

.view-content-wrap {
  padding: 0 0 0 20px !important;
}

.mobile {
  text-align: center;
  margin-bottom: 1em;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
