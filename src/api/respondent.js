import service from "src/utils/request";


// @Tags respondents
// @Summary 获取受访者列表
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /question/respondents [get]

export const getRespondentList = (data) => {
  return service({
    url: "/api/question/respondents",
    method: 'get',
    data
  })
}

// @Tags respondents
// @Summary 获取受访者列表
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /question/respondents [get]

export const deleteRespondents = (data) => {
  return service({
    url: "/api/question/respondents",
    method: 'delete',
    data
  })
}
