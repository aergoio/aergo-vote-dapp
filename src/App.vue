<template>
  <div id="app">
  <v-app>
    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>AERGO SYSTEM PARAMETER VOTING</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <account/>
        <v-list-item
          v-for="v in systemVotings"
          v-bind:key="v.id"
          @click="changeRoute(v.id)"
        >
          <v-list-item-action>
            <v-icon>mdi-vote</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ v.id }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
    <router-view/>
    <v-footer
      color="indigo"
      app
    >
    </v-footer>
    </v-content>
  </v-app>
  </div>
</template>
<script>
import Account from '@/components/Account'
import { mapState } from "vuex"

export default {
  name: 'App',
  components: {
    Account
  },
  computed: {
    ...mapState(['systemVotings'])
  },
  methods: {
    changeRoute(routeName) {
      return this.$router.push({ name: 'voting', params: { id: routeName}})
    }
  },
  data: () => ({
    drawer: false
  }),
}
</script>
