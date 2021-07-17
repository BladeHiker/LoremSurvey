import axios from 'axios'; // 引入axios
import {Notify} from "quasar";
import VueCookies from "vue-cookies";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 99999,
  withCredentials: true
})

//http request 拦截器
service.interceptors.request.use(
  config => {
    let token = null

    if (VueCookies.isKey('csrftoken')) {
      token = VueCookies.get('csrftoken');
    }
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': token
    }
    return config;
  },
  error => {
    Notify.create({message: error.toString(), color: 'negative', position: 'top', timeout: 2000, icon: 'warning'})
    return error;
  }
);


//http response 拦截器
service.interceptors.response.use(
  response => {
    switch (response.data.code) {
      case 0:
        return response
      case 1:
        //token错误
        Notify.create({message: response.data.message.toString(), color: 'warning', position: 'top', timeout: 2000})
        setTimeout(() => {
          document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          location.reload()
        }, 500)
        return response
      case 2:
        //用户操作错误
        Notify.create({message: response.data.message.toString(), color: 'orange', position: 'top', timeout: 2000})
        return response
      case -1:
        //系统错误
        Notify.create({message: '系统错误', color: 'deep-orange-14', position: 'top', timeout: 2000})
        return response
      case 7:
        Notify.create({message: response.data.message.toString(), color: 'warning', position: 'top', timeout: 2000})
        return response
      default:
        return response
    }
  },
  error => {
    Notify.create({message: error.toString(), color: 'negative', position: 'top', timeout: 2000, icon: 'warning'})
    return error
  }
)

export default service
