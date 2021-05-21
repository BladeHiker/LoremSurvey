import service from '@/utils/request'

// @Tags survey
// @Summary 添加问卷
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router question/manage [post]
// {
//    isopen int
//    title string
//    stime string
//    etime string
//    desc string
//    problemSet {}
// }
export const createSurveyItem = (data) => {
  return service({
    url: "/api/question/manage",
    method: 'post',
    data
  })
}

// @Tags survey
// @Summary 修改问卷
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router question/manage [put]
// {
//    id int
//    isopen int
//    title string
//    stime string
//    etime string
//    desc string
//    problemSet {}
// }
export const modifySurveyItem = (data) => {
  return service({
    url: "/api/question/manage",
    method: 'put',
    data
  })
}

// @Tags survey
// @Summary 获取问卷列表
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router question/manage [get]
// {
//   "id": 1,
//   "title": "编程学习问卷",
//   "desc": "沈阳航空航天大学 软件工程LoremIpsum Team 调查问卷",
//   "stime": "2021-04-01T00:00:00Z",
//   "etime": "2021-06-01T00:00:00Z",
//   "isopen": "1",
//   "status": "0" //1 已经结束 0正在进行 -1还未开始
// }
export const getSurveyList = (data) => {
  return service({
    url: "/api/question/manage",
    method: 'get',
    data
  })
}

// @Tags survey
// @Summary 获取问卷详情
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router question/manage [get]
// {id : 1}
// {
//   "code": 0,
//   "data": {
//   "title": "编程学习调研问卷close",
//     "isopen": "0",
//     "desc": "沈阳航空航天大学 软件工程LoremIpsum Team 调查问卷",
//     "stime": "2021-05-01T00:00:00Z",
//     "etime": "2021-08-01T00:00:00Z",
//     "problemSet": [
//   ]
// },
//   "message": "send success"
// }
export const getSurveyItem = (data) => {
  return service({
    url: "/api/question/manage",
    method: 'get',
    params: data
  })
}

// @Tags survey
// @Summary 删除问卷
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":"Delete questions success"}"
// @Router question/manage [delete]
// {id : 1}
export const deleteSurveyItem = (data) => {
  return service({
    url: "/api/question/manage",
    method: 'delete',
    data: data
  })
}

// @Tags survey
// @Summary 获取受访者列表和发送状态
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":""}"
// @Router question/manage [delete]
// {id : 1}
export const getSurveyRespondentList = (data) => {
  return service({
    url: "/api/question/generate",
    method: 'get',
    params: data
  })
}

// @Tags survey
// @Summary 发送问卷
// @accept application/json
// @Produce application/json
// @Success 200 {string} json "{"success":true,"data":{},"msg":""}"
// @Router question/manage [delete]
// {id : 1, userlist:[]}
export const sendSurveyToRespondents = (data) => {
  return service({
    url: "/api/question/generate",
    method: 'post',
    data
  })
}
