<template>
  <q-page class="main-con">
    <div v-if="demoMode || surveyData.statusCode===103">
      <div class="paper-header">
        <div class="text-h4 text-center paper-title">{{ demoMode ? sdata.title : surveyData.title }}</div>
        <div class="text-center paper-time" v-if="$route.params.token">ID:{{ $route.params.token }}</div>
        <br>
        <div class="text-center" v-html="demoMode?sdata.desc : surveyData.desc"></div>
      </div>
      <q-form
        ref="surveyForm"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        class="column"
        @validation-error="validError"
        @submit="submit"
      >
        <div v-for="(problem,i) in (demoMode ? sdata.problemSet: surveyData.problemSet)" :key="i" class="ques-section">
          <div v-if="problem.type===0">
            <div class="text-h6 ques-title-large">
              <b>{{ problem.index|formatIndex }} / </b>
              <span>{{ problem.title }}</span>
              <span v-if="problem.need" class="text-red"> *</span>
            </div>
            <q-input
              v-if="demoMode"
              :disable="submitted===1"
              placeholder="请输入"
              :dense="true"
              filled
              v-model="answer[i]"
              :rules="[val => !problem.need||(val!=null&&val!='') ||'必填项']"
            />
            <q-input
              v-else
              :disable="submitted===1"
              placeholder="请输入"
              :dense="true"
              filled
              v-model="answer.problemSet[i].answer"
              :rules="[val => !problem.need||(val!=null&&val!='') ||'必填项']"
            />
          </div>
          <div v-else-if="problem.type===1">
            <div class="text-h6 ques-title">
              <b>{{ problem.index |formatIndex }} / </b>
              <span>{{ problem.title }}</span>
              <span v-if="problem.need" class="text-red"> *</span>
            </div>
            <q-field
              v-if="demoMode"
              v-model="answer[i]"
              :rules="[val => !problem.need||val!=null||'必填项']"
              borderless
              :disable="submitted===1"
            >
              <template v-slot:control>
                <q-option-group
                  v-model="answer[i]"
                  :options="problem.options"
                  color="primary"
                  type="radio"
                />
              </template>
            </q-field>
            <q-field
              v-else
              v-model="answer.problemSet[i].option"
              :rules="[val => !problem.need||val!=null||'必填项']"
              borderless
              :disable="submitted===1"
            >
              <template v-slot:control>
                <q-option-group
                  v-model="answer.problemSet[i].option"
                  :options="problem.options"
                  color="primary"
                  type="radio"
                />
              </template>
            </q-field>
          </div>
        </div>
        <q-btn
          :label="submitted===1?'提交成功': '提交'"
          :color="submitted===1?'secondary': 'primary'"
          type="submit"
          class="flex-center submit-btn"
          :disable="submitted!==0"
          :loading="submitted===-1"
        />

      </q-form>
    </div>
    <div v-else-if="surveyData.statusCode===104" class="flex flex-center text-secondary text-h5">
      您已提交此问卷
    </div>
    <div v-else class="flex flex-center text-secondary text-h5">
      问卷已停止收集
    </div>
    <br>
    <q-separator/>
    <div class="paper-footer text-center">

      Copyright © 2021 LoremIpsum Team
      <br/>
      问卷系统由<span class="no-wrap">LoremSurvey</span>提供
      <br/>
      <a href="#" class="q-link">意见反馈</a>
    </div>

  </q-page>
</template>

<script>

import {Notify} from "quasar";
import {getSurvey, submitSurvey} from "src/api/api";

export default {
  name: "survey",
  props: {
    sdata: Object
  },
  data() {
    return {
      surveyData: {
        title: "",
        desc: "",
        problemSet: []
      },
      // surveyData: {
      //   "title": "编程学习调研问卷",
      //   "isopen": "1",
      //   isrunning: 1,
      //   "desc": "沈阳航空航天大学 软件工程LoremIpsum Team 调查问卷",
      //   "stime": "2021/4/1",
      //   "etime": "2021/6/1",
      //   "problemSet": [
      //     {
      //       "index": 1,
      //       "type": 1,
      //       "title": "您目前的职业是?",
      //       "need": "True",
      //       "options": [
      //         {
      //           "label": "在校学生",
      //           "value": "1"
      //         },
      //         {
      //           "label": "政府/机关干部/公务员",
      //           "value": "2"
      //         },
      //         {
      //           "label": "企业管理者（包括基层及中高层管理者）",
      //           "value": "3"
      //         },
      //         {
      //           "label": "普通职员（办公室 / 写字楼工作人员）",
      //           "value": "4"
      //         },
      //         {
      //           "label": "专业人员（如医生 / 律师 / 文体 / 记者 / 老师等）",
      //           "value": "5"
      //         },
      //         {
      //           "label": "普通工人（如工厂工人 / 体力劳动者等）",
      //           "value": "6"
      //         },
      //         {
      //           "label": "商业服务业职工（如销售人员 / 商店职员 / 服务员等）",
      //           "value": "7"
      //         },
      //         {
      //           "label": "个体经营者 / 承包商",
      //           "value": "8"
      //         },
      //         {
      //           "label": "自由职业者",
      //           "value": "9"
      //         },
      //         {
      //           "label": "农林牧渔劳动者",
      //           "value": "10"
      //         },
      //         {
      //           "label": "退休",
      //           "value": "11"
      //         },
      //         {
      //           "label": "暂无职业",
      //           "value": "12"
      //         },
      //         {
      //           "label": "others",
      //           "value": "#"
      //         }
      //       ]
      //     },
      //     {
      //       "index": 2,
      //       "type": 1,
      //       "title": "您学习编程多久了?",
      //       "need": "True",
      //       "options": [
      //         {
      //           "label": "不到3个月",
      //           "value": "1"
      //         },
      //         {
      //           "label": "3-6个月",
      //           "value": "2"
      //         },
      //         {
      //           "label": "6-12个月",
      //           "value": "3"
      //         },
      //         {
      //           "label": "1-3年以上",
      //           "value": "4"
      //         },
      //         {
      //           "label": "3年以上",
      //           "value": "5"
      //         },
      //         {
      //           "label": "others",
      //           "value": "#"
      //         }
      //       ]
      //     },
      //     {
      //       "index": 7,
      //       "type": 1,
      //       "title": "您希望订阅我们的信息吗?",
      //       "need": "False",
      //       "options": [
      //         {
      //           "label": "是",
      //           "value": "True"
      //         },
      //         {
      //           "label": "否",
      //           "value": "False"
      //         },
      //         {
      //           "label": "others",
      //           "value": "#"
      //         }
      //       ]
      //     },
      //     {
      //       "index": 3,
      //       "type": 0,
      //       "title": "您如何学习编程?",
      //       "need": "False"
      //     },
      //     {
      //       "index": 4,
      //       "type": 0,
      //       "title": "您学习的方向是?",
      //       "need": "True"
      //     },
      //     {
      //       "index": 5,
      //       "type": 0,
      //       "title": "您为什么要学习编程?",
      //       "need": "True"
      //     },
      //     {
      //       "index": 6,
      //       "type": 0,
      //       "title": "您的联系方式?",
      //       "need": "False"
      //     }
      //   ]
      // },
      answer: {
        sessionid: null,
        problemSet: []
      },
      submitted: 0,
      res: null,
      sessionId: null,
      demoMode: false
    }
  },
  async created() {
    if (!this.$route.params.token) {
      this.demoMode = true
      return
    }
    //鉴权
    this.sessionId = this.$route.params.token
    const res = await getSurvey({sessionid: this.sessionId})
    this.surveyData = res.data.data
    if (this.surveyData.statusCode === 105) {
      await this.$router.push("/404")
    }
    if (this.surveyData.statusCode === 103) {
      document.title = this.surveyData.title + " -LoremSurvey"
      if (!this.surveyData.isrunning) this.submitted = 1
      this.answer.sessionid = this.sessionId
      for (let i = 0; i < this.surveyData.problemSet.length; ++i) {
        if (this.surveyData.problemSet[i].type === 1) {
          //选择题
          this.answer.problemSet.push({index: i + 1, option: null})
        } else if (this.surveyData.problemSet[i].type === 0) {
          //填空题
          this.answer.problemSet.push({index: i + 1, answer: null})
        }
      }
    }
  },
  filters: {
    formatIndex: function (index) {
      if (index < 10) return '0' + index
      return index
    }
  },
  methods: {
    submit() {
      if (this.demoMode) {
        Notify.create({message: "模拟提交动作，不会收集数据", color: 'secondary', position: 'top', timeout: 500})
        this.submitted = -1
        setTimeout(() => {
          this.submitted = 1
        }, 1000)

        return
      }
      this.submitted = -1
      submitSurvey(this.answer).then((res) => {
        if (res.data.code === 0) {
          this.submitted = 1
        } else {
          this.submitted = 0
        }
      })

    },
    validError() {
      Notify.create({message: "存在未填项", color: 'negative', position: 'top', timeout: 1500, icon: 'warning'})
    }
  }
}
</script>

<style scoped>
.paper-header {
  padding-top: 50px;
  padding-bottom: 20px;
  max-width: min(100vw, 800px);
  max-width: 100%;
  word-wrap: anywhere;
}

.paper-title {

}

.paper-time {
  margin: 5px;
  color: #aaa;
}

.main-con {
  width: min(100vw, 800px);
  width: min(100%, 800px);
  padding: 30px;
  background-color: #ffffff;
  overflow-x: hidden;
}

.ques-title {
  margin-bottom: 8px;
}

.ques-title-large {
  margin-bottom: 20px;
}

.ques-section {
  margin: 15px 0;
}

.submit-btn {
}

.paper-footer {
  height: 80px;
  padding: 20px;
}
</style>
