<template>
  <q-page class="main-con">
    <div v-if="loading" class="flex flex-center text-secondary text-h7">
      <q-inner-loading showing>
        <q-spinner-gears size="50px" color="secondary"/>
        <br>
        加载中...
      </q-inner-loading>
    </div>
    <div v-else-if="demoMode || surveyData.statusCode===103">
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
              <span v-if="problem.title!==''">{{ problem.title }}</span>
              <span v-else class="text-italic text-grey">(未设置题目)</span>
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
              <span v-if="problem.title!==''">{{ problem.title }}</span>
              <span v-else class="text-italic text-grey">(未设置题目)</span>
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
              v-model="answer.problemSet[i].answer"
              :rules="[val => !problem.need||val!=null||'必填项']"
              borderless
              :disable="submitted===1"
            >
              <template v-slot:control>
                <q-option-group
                  v-model="answer.problemSet[i].answer"
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
    <div v-else-if="surveyData.statusCode===104" class="flex flex-center text-secondary text-h5 q-mt-lg">
      您已提交此问卷
    </div>
    <div v-else class="flex flex-center text-secondary text-h5 q-mt-lg">
      问卷已停止收集
    </div>
    <br>
    <q-separator v-if="!loading" class="q-ma-md"/>
    <div v-if="!loading" class="paper-footer text-center">
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
      answer: {
        problemSet: []
      },
      submitted: 0,
      res: null,
      sessionId: null,
      demoMode: false,
      loading: true
    }
  },
  async created() {
    if (!this.$route.params.token) {
      this.demoMode = true
      this.loading = false
      return
    }
    //鉴权
    this.sessionId = this.$route.params.token
    const res = await getSurvey({sessionid: this.sessionId})
    this.surveyData = res.data.data
    if (this.surveyData.statusCode === 105) {
      await this.$router.push("/survey")
    }
    if (this.surveyData.statusCode === 103) {
      document.title = this.surveyData.title + " -LoremSurvey"
      if (!this.surveyData.running) this.submitted = 1

      this.surveyData.problemSet.sort((a, b) => {
        return a.index > b.index ? 1 : -1
      })

      for (let i = 0; i < this.surveyData.problemSet.length; ++i) {
        if (this.surveyData.problemSet[i].type === 1) {
          //选择题
          this.answer.problemSet.push({index: i + 1, answer: null, id: this.surveyData.problemSet[i].id})
        } else if (this.surveyData.problemSet[i].type === 0) {
          //填空题
          this.answer.problemSet.push({index: i + 1, answer: null, id: this.surveyData.problemSet[i].id})
        }
      }
    }
    this.loading = false
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
      submitSurvey({sessionid: this.sessionId}, {problemSet: this.answer.problemSet}).then((res) => {
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
