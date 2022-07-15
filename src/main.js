import Vue from 'vue'
import App from './App.vue'
import Glitch from 'vue-glitch';
import movable from "v-movable";
import ProgressBar from 'vuejs-progress-bar';
import VueParticles from 'vue-particles';
import store from './store/';
import router from '@/router';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faGem, faFileArrowDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlay);
library.add(faGem);
library.add(faFileArrowDown);
library.add(faMagnifyingGlass);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;


Vue.use(VueParticles);
Vue.use(ProgressBar);
Vue.use(movable);
Vue.component('glitch', Glitch);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app');


