import Vue from 'vue'
import App from './App.vue'
import Glitch from 'vue-glitch';

Vue.component('glitch', Glitch);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
