<template>
  <v-list-item
    link
    @click="connectAccount"
  >
    <v-list-item-content>
      <v-list-item-title class="title">Connect Account</v-list-item-title>
      <v-list-item-subtitle v-if="account">{{ account.address }}</v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-icon>mdi-refresh</v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    account: {
      get () {
        return this.$store.state.activeAccount
      },
      set (v) {
        this.$store.commit('setActiveAccount', v)
      }
    }
  },
  methods: {
    async connectAccount () {
      this.account = await this.$store.dispatch('getActiveAccount')
      console.log('connect account', this.account)
    }
  },
  data () {
    return {
    }
  }
}
</script>
