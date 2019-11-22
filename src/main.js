import Vue from 'vue'
import '@aergoenterprise/lib-components/src/styles/base.scss';
import App from './App.vue'
import store from './store'
import router from './router'
import { formatToken } from './filters/formatToken';

Vue.config.productionTip = false

Vue.filter('formatToken', formatToken);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')