<template>
  <Vertical base="fill" class="view-login">
    <ViewTitle>My Account</ViewTitle>

    <Island>
      <p>To vote and view your current votes, please login with Aergo Connect.</p>
      <p>Please use an account for the chain with the id <strong>{{activeChainId ? activeChainId.chainid.magic : "..."}}</strong>.</p>
      <LoginWithAergoConnect @click.native="connectAccount" />
    </Island>
  </Vertical>
</template>
<script>
import { mapState } from "vuex";
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { ViewTitle } from '@aergoenterprise/lib-components/src/basic';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import { LoginWithAergoConnect } from '@aergoenterprise/lib-components/src/composite/buttons';

export default {
  components: {
    Island,
    IslandHeader,
    ViewTitle,
    Vertical,
    LoginWithAergoConnect,
  },
  computed: {
    ...mapState(['activeChainId', 'activeAccount']),
  },
  methods: {
    async connectAccount () {
      const account = await this.$store.dispatch('refreshActiveAccount');
      const chainId = this.activeChainId.chainid.magic;
      if (chainId != account.chainId) {
        alert(`The selected account's chain id does not match the expected chain id ${chainId}. Please select another account.`);
        return;
      }
    }
  },
  watch: {
    activeAccount() {
      if (this.activeAccount) {
        this.$router.push({ name: 'account', params: { address: this.activeAccount.address }});
      }
    }
  }
}
</script>
<style lang="scss">
.view-login .login-with-aergo-connect {
  margin-top: 20px;
  margin-left: -5px;
  width: 250px;
}
.view-login strong {
  font-weight: 500;
}
</style>