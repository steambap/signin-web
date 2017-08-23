import Vue from 'vue';
import App from './view/home';
import store from './store';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import './style.css';

Vue.use(Mint);

Vue.config.errorHandler = console.error;

const app = new Vue({
  store,
  ...App
});

app.$mount('#app');
