<template>
  <q-page class="main-con " :class="{'flex flex-center column':!showQuestions}">
    <div v-if="loading" class="flex flex-center text-secondary text-h7">
      <q-inner-loading showing>
        <q-spinner-gears size="50px" color="secondary"/>
        <br>
        加载中...
      </q-inner-loading>
    </div>
    <div class="flex column items-stretch" v-else-if="demoMode || surveyData.statusCode===103">
      <div class="paper-header">
        <div class="text-h4 text-center paper-title">{{ surveyData.title }}</div>
        <div class="text-center paper-time" v-if="$route.params.token">ID:{{ $route.params.token.toUpperCase() }}</div>
        <br>
        <div v-html="surveyData.desc"></div>
      </div>
      <div class="text-center q-pa-lg" v-if="!showQuestions">
        <q-space/>
        <q-btn outline icon="arrow_downward" color="secondary" @click="startQuiz" round>
          <q-tooltip content-class="desktop-only">
            开始问卷
          </q-tooltip>
        </q-btn>
      </div>
      <transition name="fade">
        <q-form
          v-if="showQuestions"
          ref="surveyForm"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          class="column"
          @validation-error="validError"
        >
          <!--          <q-separator v-if="!loading" class="q-ma-md"/>-->

          <div v-for="(question,i) in  surveyData.questionSet" :key="i"
               class="ques-section">
            <q-separator v-if="!loading" class="q-mb-sm" size="2px" style="background: rgba(0, 0, 0, 0.05);"/>

            <div v-if="question.type===0">
              <div class="text-h6 ques-title-large">
                <b>{{ question.index|formatIndex }} / </b>
                <span v-if="question.title!==''">{{ question.title }}</span>
                <span v-else class="text-italic text-grey">(未设置题目)</span>
                <span v-if="question.need" class="text-red"> *</span>
              </div>
              <q-input
                :disable="submitted===1"
                placeholder="请输入"
                :dense="true"
                filled
                v-model="answer.questionSet[i].answer"
                :rules="[val => !question.need||(val!=null&&val!='') ||'必填项']"
                @keydown.enter.prevent
              />
            </div>
            <div v-else-if="question.type===1||question.type===2">
              <div class="text-h6 ques-title">
                <b>{{ question.index |formatIndex }} / </b>
                <span v-if="question.title!==''">{{ question.title }}</span>
                <span v-else class="text-italic text-grey">(未设置题目)</span>
                <span v-if="question.need" class="text-red"> *</span>
                <q-chip v-if="question.type===2" dense square class="float-right" outline color="teal-4"
                        label="多选题"/>
              </div>
              <q-field
                v-model="answer.questionSet[i].answer"
                :rules="[val => !question.need||val!=null||'必填项']"
                borderless
                :disable="submitted===1"
              >
                <template v-slot:control>
                  <q-option-group
                    v-model="answer.questionSet[i].answer"
                    :options="question.options"
                    color="primary"
                    :type="question.type===1? 'radio':'checkbox'"
                  />
                </template>
              </q-field>
            </div>
          </div>
          <q-btn
            :label="submitted===1?'提交成功': '提交'"
            :color="submitted===1?'secondary': 'primary'"
            class="flex-center submit-btn"
            :disable="submitted!==0"
            :loading="submitted===-1"
            @click="submit"
          />

        </q-form>
      </transition>
    </div>
    <div v-else-if="surveyData.statusCode===104" class="flex flex-center text-secondary text-h5 q-mt-lg">
      您已提交此问卷
    </div>
    <div v-else class="flex flex-center text-secondary text-h5 q-mt-lg">
      问卷已停止收集
    </div>
    <br>
    <q-separator v-if="!loading" class="q-ma-md"/>
    <div v-if="!loading" class="paper-footer text-center" :class="{'fixed-bottom':!showQuestions}"
         style="height: 100px">
      Copyright © 2021 LoremIpsum Team
      <br/>
      问卷系统由<a href="/" class="no-wrap q-link">LoremSurvey</a>提供
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
        questionSet: []
      },
      answer: {
        questionSet: []
      },
      submitted: 0,
      res: null,
      sessionId: null,
      demoMode: false,
      loading: true,
      showQuestions: false
    }
  },
  mounted() {
    // let that = this
    // window.onbeforeunload = function (e) {
    //   if (that.submitted !== 1) {
    //     e = e || window.event;
    //     // 兼容IE8和Firefox 4之前的版本
    //     if (e) {
    //       e.returnValue = '关闭提示';
    //     }
    //     // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    //     return '关闭提示';
    //   } else {
    //     window.onbeforeunload = null
    //   }
    // };
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

      this.surveyData.questionSet.sort((a, b) => {
        return a.index > b.index ? 1 : -1
      })

      for (let i = 0; i < this.surveyData.questionSet.length; ++i) {
        if (this.surveyData.questionSet[i].type === 1) {
          //选择题
          this.answer.questionSet.push({index: i + 1, answer: null, id: this.surveyData.questionSet[i].id})
        } else if (this.surveyData.questionSet[i].type === 0) {
          //填空题
          this.answer.questionSet.push({index: i + 1, answer: null, id: this.surveyData.questionSet[i].id})
        } else if (this.surveyData.questionSet[i].type === 2) {
          //多选
          this.answer.questionSet.push({index: i + 1, answer: [], id: this.surveyData.questionSet[i].id})
        }
      }
    }
    this.loading = false
  },
  mounted() {
    if (this.demoMode) {
      this.$nextTick(() => {
          this.surveyData = this.$props.sdata
          this.surveyData.questionSet.sort((a, b) => {
            return a.index > b.index ? 1 : -1
          })

          for (let i = 0; i < this.surveyData.questionSet.length; ++i) {
            if (this.surveyData.questionSet[i].type === 1) {
              //选择题
              this.answer.questionSet.push({index: i + 1, answer: null, id: this.surveyData.questionSet[i].id})
            } else if (this.surveyData.questionSet[i].type === 0) {
              //填空题
              this.answer.questionSet.push({index: i + 1, answer: null, id: this.surveyData.questionSet[i].id})
            } else if (this.surveyData.questionSet[i].type === 2) {
              //多选
              this.answer.questionSet.push({index: i + 1, answer: [], id: this.surveyData.questionSet[i].id})
            }
          }
        }
      )
    }
  },
  filters: {
    formatIndex: function (index) {
      if (index < 10) return '0' + index
      return index
    }
  }
  ,
  methods: {
    startQuiz() {
      this.showQuestions = true
    }
    ,
    submit() {
      this.$refs.surveyForm.validate().then(success => {
        if (success) {
          if (this.demoMode) {
            Notify.create({message: "模拟提交动作，不会收集数据", color: 'secondary', position: 'top', timeout: 500})
            this.submitted = -1
            setTimeout(() => {
              this.submitted = 1
            }, 1000)
            return
          }
          this.submitted = -1
          submitSurvey({sessionid: this.sessionId}, {questionSet: this.answer.questionSet}).then((res) => {
            if (res.data.code === 0) {
              this.submitted = 1
            } else {
              this.submitted = 0
            }
          })
        }
      })


    }
    ,
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
  color: #3c4858;
}

.paper-time {
  margin: 5px;
  color: #aaa;
  font-family: cursive;
  font-size: 12px;
}

.main-con {
  width: min(100vw, 800px);
  width: min(100%, 800px);
  padding: 30px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow-x: hidden;
  /*border-radius: 10px;*/
  box-shadow: 0 1px 5px #d9e2fb, 0 2px 2px #d9e2fb, 0 3px 1px -2px #d9e2fb;
  border-top: #1976D2 5px solid;
}

.ques-title {
  margin-bottom: 8px;
}

.ques-title, .ques-title-large {
  color: #3F4049;
  font-weight: bold;
}

.ques-title-large {
  margin-bottom: 20px;
}

.ques-section {
  margin-top: 5px;
}

.submit-btn {
}

.paper-footer {
  height: 80px;
  padding: 20px;
}

.fade-enter-active, .fade-leave-active {
  animation: hei 1s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes hei {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
