import Vue from 'vue'
import App from './App.vue'
import Glitch from 'vue-glitch';
import movable from "v-movable";
import ProgressBar from 'vuejs-progress-bar'
import VueParticles from 'vue-particles'

Vue.use(VueParticles)
Vue.use(ProgressBar)
Vue.use(movable);
Vue.component('glitch', Glitch);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
