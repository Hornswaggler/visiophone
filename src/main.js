import Vue from 'vue'
import App from './App.vue'
import Glitch from 'vue-glitch';
import movable from "v-movable";
import ProgressBar from 'vuejs-progress-bar'
import VueParticles from 'vue-particles'
import Vuex from 'vuex'
import rootStore from './store'


Vue.use(Vuex);
Vue.use(VueParticles);
Vue.use(ProgressBar);
Vue.use(movable);
Vue.component('glitch', Glitch);
Vue.config.productionTip = false;

const store = new Vuex.Store(rootStore);


console.log('Here');

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
