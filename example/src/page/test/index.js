import 'yma-csskit/reset.css';

import Vue from 'vue';
import App from './app.vue';
import Comp from '../../../../src/index.js';
Vue.use(Comp);

new Vue({
    render: h => h(App),
}).$mount('#app');
