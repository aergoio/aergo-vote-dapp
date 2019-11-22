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
        <router-view />
      </template>
    </ViewWithSidebar>
  </div>
</template>
<script>
import { mapState } from "vuex"
import { LogoGeneric } from '@aergoenterprise/lib-components/src/basic';
import { LoginWithAergoConnect } from '@aergoenterprise/lib-components/src/composite/buttons';
import { ViewWithSidebar } from '@aergoenterprise/lib-components/src/composite/templates';
import { SidebarMenu } from '@aergoenterprise/lib-components/src/composite/Sidebar';
import { capitalize } from '@aergoenterprise/lib-components/src/filters/capitalize';

export default {
  name: 'App',
  components: {
    ViewWithSidebar,
    SidebarMenu,
    LogoGeneric,
    LoginWithAergoConnect,
  },
  data() {
    return {
      account: null,
    };
  },
  computed: {
    ...mapState(['systemVotings', 'activeChainId', 'activeAccount']),
    menuItems() {
      const votes = this.systemVotings.map((item, index) => {
        return {
          id: index,
          label: capitalize(item.id.toLowerCase()),
          routeAttrs: {
            to: { name: 'voting', params: { id: item.id } },
          },
        };
      });
      return [
        {
          id: 'account',
          label: 'My Account',
          routeAttrs: {
            to: this.activeAccount ? { name: 'account', params: { address: this.activeAccount.address } } : { name: 'login' },
          },
        }
      ].concat(votes);
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
    document.title = "Beta · aergo voting"
    this.$store.dispatch('getAergo', { url: process.env.VUE_APP_AERGO_NODE })
  },
}
</script>

<style>
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
  margin: auto 32px 40px 32px;
}
</style>
