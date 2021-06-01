import axios from 'axios'; // 引入axios
import {Notify} from "quasar";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 99999,
  withCredentials: true
})

//http request 拦截器
service.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json',
    }
    return config;
  },
  error => {
    Notify.create({message: error.toString(), color: 'negative', position: 'top', timeout: 1500, icon: 'warning'})
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
        Notify.create({message: response.data.message.toString(), color: 'warning', position: 'top', timeout: 1500})
        setTimeout(() => {
          document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          location.reload()
        }, 500)
        return response
      case 2:
        //用户操作错误
        Notify.create({message: response.data.message.toString(), color: 'info', position: 'top', timeout: 1500})
        return response
      case 7:
        Notify.create({message: response.data.message.toString(), color: 'warning', position: 'top', timeout: 1500})
        return response
      default:
        return response
    }
  },
  error => {
    Notify.create({message: error.toString(), color: 'negative', position: 'top', timeout: 1500, icon: 'warning'})
    return error
  }
)

export default service
