import service from "src/utils/request";

export const getSurvey = (data) => {
  return service({
    url: "/api/question/answer",
    method: 'get',
    params: data
  })
}


export const submitSurvey = (query, data) => {
  return service({
    url: "/api/question/answer",
    method: 'post',
    params: query,
    data
  })
}

export const login = (data) => {
  return service({
    url: "/api/user/login",
    method: 'post',
    data
  })
}
export const register = (data) => {
  return service({
    url: "/api/user/register",
    method: 'post',
    data
  })
}

export const logout = (data) => {
  return service({
    url: "/api/user/logout",
    method: 'post',
    data
  })
}

export const getCaptcha = (data) => {
  return service({
    url: "/api/user/getcaptcha",
    method: 'get',
    data
  })
}

