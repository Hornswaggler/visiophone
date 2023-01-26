import Vue from 'vue';
import App from './App.vue';
import Glitch from 'vue-glitch';
import vueDebounce from 'vue-debounce';
import ProgressBar from 'vuejs-progress-bar';
import VueParticles from 'vue-particles';
import store from './store/';
import router from '/src/router';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlay,
  faGem,
  faFileArrowDown,
  faMagnifyingGlass,
  faGrip,
  faGripLines,
  faSquarePlus,
  faGear,
  faAngleLeft,
  faAngleRight,
  faBars,
  faPlus,
  faHouse,
  faCloudArrowUp,
  faHeartMusicCameraBolt,
  faCaretUp,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import config from '/src/config';


library.add(faPlay);
library.add(faGem);
library.add(faFileArrowDown);
library.add(faMagnifyingGlass);
library.add(faGrip);
library.add(faGripLines);
library.add(faSquarePlus);
library.add(faGear);
library.add(faAngleLeft);
library.add(faAngleRight);
library.add(faBars);
library.add(faPlus);
library.add(faHouse);
library.add(faCloudArrowUp);
library.add(faHeartMusicCameraBolt);
library.add(faCaretUp);
library.add(faCaretDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(VueParticles);
Vue.use(ProgressBar);
Vue.use(vueDebounce, {
  defaultTime: config.VITE_API_DEBOUNCE
})
Vue.component('glitch', Glitch);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app');
