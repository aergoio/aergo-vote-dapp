<template>
  <v-list-item
    link
  >
    <v-list-item-content>
      <v-list-item-title class="title" v-if="account" @click="emitAccount">{{ account.address }}</v-list-item-title>
      <v-list-item-title class="title" v-else>Connect Account</v-list-item-title>
      <v-list-item-subtitle v-if="account">balance : {{ balance }}</v-list-item-subtitle>
      <v-list-item-subtitle v-if="account">staked : {{ staked }}</v-list-item-subtitle>
    </v-list-item-content>

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
    staked: {
      get () {
        return this.$store.state.staked
      },
      set (v) {
        this.$store.commit('setStaked', v)
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
    }
  },
  data () {
    return {
    }
  }
}
</script>
