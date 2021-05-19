import {service, URL_Prefix} from "src/utils/request";

export const getSurvey = (data) => {
  return service({
    url: URL_Prefix + "/question/answer",
    method: 'get',
    params: data
  })
}


export const submitSurvey = (data) => {
  return service({
    url: URL_Prefix + "/question/answer",
    method: 'post',
    data
  })
}

export const login = (data) => {
  return service({
    url: URL_Prefix + "/user/login",
    method: 'post',
    data
  })
}
export const register = (data) => {
  return service({
    url: URL_Prefix + "/user/register",
    method: 'post',
    data
  })
}

export const logout = (data) => {
  return service({
    url: URL_Prefix + "/user/logout",
    method: 'post',
    data
  })
}
