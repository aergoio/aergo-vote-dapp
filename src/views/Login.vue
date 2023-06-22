<template>
  <Vertical base="fill" class="view-login">
    <ViewTitle>My Account</ViewTitle>
    <slot></slot>
    <Island>
      <p>To vote and view your current votes, please login with Aergo Connect 3.0.</p>
      <p>Please use an account for the chain with the id <strong>{{activeChainId ? activeChainId.chainid.magic : "..."}}</strong>.</p>
      <div class="row">
        <LoginWithAergoConnect @click.native="connectAccount" />
        <span>or</span>
        <a target="_blank" href="https://chrome.google.com/webstore/detail/aergo-connect-30/mcijhnoalllmbiehiebonblllpimlnle">
          <Button rounded type="simple" style="display: inline-block">Install from Chrome Webstore</Button>
        </a>
      </div>
    </Island>
  </Vertical>
</template>
<script>
import { mapState } from 'vuex';
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import ViewTitle from '../components/ViewTitle';
import { Island, IslandHeader } from '@aergoenterprise/lib-components/src/composite';
import { LoginWithAergoConnect } from '@aergoenterprise/lib-components/src/composite/buttons';
import { Button } from '@aergoenterprise/lib-components/src/composite/buttons';

export default {
  components: {
    Island,
    IslandHeader,
    ViewTitle,
    Vertical,
    LoginWithAergoConnect,
    Button,
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
<style lang="scss" scoped>
.view-login .login-with-aergo-connect {
  margin-left: -5px;
  width: 200px;
}
.view-login strong {
  font-weight: 500;
}
.row {
  display: flex;
  align-items: center;
  margin-top: 20px;

  > * {
    margin-right: 25px;
  }
}
</style>
