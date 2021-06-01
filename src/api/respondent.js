import service from "src/utils/request";


// @Tags respondent
// @Summary 获取受访者列表
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /question/respondent [get]

export const getRespondentList = (data) => {
  return service({
    url: "/api/question/respondent",
    method: 'get',
    data
  })
}

// @Tags respondent
// @Summary 获取受访者列表
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /question/respondent [get]

export const deleteRespondents = (data) => {
  return service({
    url: "/api/question/respondent",
    method: 'delete',
    data
  })
}
