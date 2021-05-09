import axios from 'axios'; // 引入axios
import {Notify} from "quasar";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 99999
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
    if (response.data.code === 0 || response.headers.success === "true") {
      return response.data
    }
  },
  error => {
    Notify.create({message: error.toString(), color: 'negative', position: 'top', timeout: 1500, icon: 'warning'})
    console.log(error.toString())
    return error
  }
)

export default service
