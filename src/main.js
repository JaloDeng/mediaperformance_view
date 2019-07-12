// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import { getRequest, postRequest } from './request/http'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.moment = Moment
Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
