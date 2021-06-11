import Vue from "vue";
import md5 from "js-md5"
import VueCookies from 'vue-cookies'

Vue.prototype.$md5 = md5
Vue.use(VueCookies)
