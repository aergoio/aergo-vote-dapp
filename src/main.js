import Vue from 'vue'
import '@aergoenterprise/lib-components/src/styles/base.scss';
import App from './App.vue'
import store from './store'
import router from './router'
import { formatToken } from './filters/formatToken';
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false

Vue.filter('formatToken', formatToken);

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: 'UA-117920519-1',
    router,
  });
}

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')