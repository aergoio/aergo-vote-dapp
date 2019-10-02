<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <account/>
        <v-list-item
          v-for="v in systemVotings"
          v-bind:key="v.id"
          @click.stop=""
        >
          <v-list-item-action>
            <v-icon>mdi-vote</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ v.id }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>AERGO SYSTEM PARAMETER VOTING</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <system-voting
      v-for="v in systemVotings"
      v-bind:key="v.id"
      :id="v.id">
    </system-voting>
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
  import SystemVoting from '@/components/SystemVoting'
  import Account from '@/components/Account'
  export default {
    components: {
      SystemVoting,
      Account
    },
    data: () => ({
      drawer: null,
      systemVotings: [
        { id: 'BP' },
        { id: 'BPCOUNT' },
        { id: 'GASPRICE' },
        { id: 'STAKINGMIN' },
        { id: 'NAMEPRICE' }
      ]
    }),
  }
</script>