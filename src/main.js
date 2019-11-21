import Vue from 'vue'
import '@aergoenterprise/lib-components/src/styles/base.scss';
import './styles.scss';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')