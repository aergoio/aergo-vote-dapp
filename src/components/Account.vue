<template>
  <v-list-item
    link
  >
    <v-list-item-content>
      <v-list-item-title class="title" v-if="account" @click="emitAccount">{{ account.address }}</v-list-item-title>
      <v-list-item-title class="title" v-else @click="connectAccount">Connect Account</v-list-item-title>
      <v-list-item-subtitle v-if="account" @click="emitAccount">chainId : {{ chainId }}</v-list-item-subtitle>
      <v-list-item-subtitle v-if="account" @click="emitAccount">balance : {{ balance }}</v-list-item-subtitle>
      <v-list-item-subtitle v-if="account" @click="emitAccount">staked : {{ staked }}</v-list-item-subtitle>
    </v-list-item-content>
        <v-alert
          v-model="message.show"
          v-bind:type="message.type"
          dismissible
          dense
        >
          {{message.text}}
        </v-alert>

    <v-list-item-action
      @click="connectAccount"
    >
      <v-icon>mdi-refresh</v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  computed: {
    account: {
      get () {
        return this.$store.state.activeAccount
      },
      set (v) {
        this.$store.commit('setActiveAccount', v)
      }
    },
    chainId: {
      get () {
        return this.$store.state.activeChainId.chainid.magic
      },
      set (v) {
        this.$store.commit('setActiveChainId', v)
      }
    },
    staked: {
      get () {
        return this.$store.state.staked
      }
    },
    balance: {
      get () {
        return this.$store.state.balance
      },
      set (v) {
        this.$store.commit('setBalance', v)
      }
    }
  },
  methods: {
    emitAccount: function(){
      this.$emit('emitAccount', this.account.address);
    },
    async connectAccount () {
      this.account = await this.$store.dispatch('refreshActiveAccount')
      if (this.$store.state.activeChainId.chainid.magic != this.account.chainId ) {
        this.message.text = "wrong chain " + this.account.chainId
        this.message.type = 'error'
        this.message.show = true
        this.account = null
        return
      }
      this.emitAccount()
    }
  },
  data () {
    return {
      message : {show: false, type: 'success'}
    }
  }
}
</script>
