import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import 'iview/dist/styles/iview.css';
import {Progress} from 'iview';

// 注册到全局
Vue.use(VueResource);
Vue.component('Progress', Progress);

require('./assets/webuploader/webuploader.css')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
