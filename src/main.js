// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store';
Vue.config.productionTip = false

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer);

import {instance as http} from './assets/js/http.js'
Vue.prototype.$http = http

import API from './assets/js/api.js'
Vue.prototype.$api = API;
import wx from 'weixin-js-sdk';
Vue.prototype.$wx = wx;
import { Dialog } from 'vant';
Vue.use(Dialog);
import './assets/js/rem.js'

import './assets/scss/main.scss'
import 'vant/lib/index.css'

import popup from './assets/components/popup'
Vue.use(popup)
// import { Actionsheet } from 'vant';
// Vue.use(Actionsheet);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
