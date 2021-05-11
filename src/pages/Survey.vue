<template>
  <q-page class="main-con">
    <div>
      <div class="paper-header">
        <div class="text-h4 text-center paper-title">{{ surveyData.title }}</div>
        <div class="text-center paper-time">{{ surveyData.stime }}~{{ surveyData.etime }}</div>
        <div class="text-center paper-time" v-if="$route.params.token">ID:{{ $route.params.token }}</div>
        <br>
        <div class="text-center">{{ surveyData.desc }}</div>
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
        <div v-for="(problem,i) in surveyData.problemSet" :key="i" class="ques-section">
          <div v-if="problem.type===0">
            <div class="text-h6 ques-title-large">
              <b>{{ problem.index|formatIndex }} / </b>
              <span>{{ problem.title }}</span>
              <span v-if="problem.need" class="text-red"> *</span>
            </div>
            <q-input placeholder="请输入"
                     :dense="true"
                     filled
                     v-model="answer[i]"
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
              v-model="answer[i]"
              :rules="[val => !problem.need||val!=null||'必填项']"
              borderless
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
    <br>
    <q-separator/>
    <div class="paper-footer text-center">

      Copyright © 2021 LoremIpsum Team
      <br>
      系统由LoremSurvey提供
    </div>

  </q-page>
</template>

<script>

import {Notify} from "quasar";
import {getSurvey} from "src/api/api";

export default {
  name: "survey",
  data() {
    return {
      // surveyData: null,
      surveyData: {
        title: "编程学习调研问卷",
        stime: "2021/4/1",
        etime: "2021/6/1",
        desc: "沈阳航空航天大学 软件工程LoremIpsum Team 调查问卷",
        problemSet: [
          {
            type: 1,
            index: 1,
            need: true,
            title: "您目前的职业是?",
            options: [
              {label: '在校学生', value: 1},
              {label: '政府/机关干部/公务员', value: 2},
              {label: '企业管理者（包括基层及中高层管理者）', value: 3},
              {
                label: '普通职员（办公室 / 写字楼工作人员）', value: 4
              },
              {label: '专业人员（如医生 / 律师 / 文体 / 记者 / 老师等）', value: 5},
              {label: '普通工人（如工厂工人 / 体力劳动者等）', value: 6},
              {
                label: '商业服务业职工（如销售人员 / 商店职员 / 服务员等）', value: 7
              },
              {label: '个体经营者 / 承包商', value: 8},
              {label: '自由职业者', value: 9},
              {label: '农林牧渔劳动者', value: 10},
              {
                label: '退休',
                value: 11
              },
              {label: '暂无职业', value: 12}
            ],
          },
          {
            type: 1,
            index: 2,
            need: true,
            title: "您学习编程多久了?",
            options:
              [
                {
                  label: '不到3个月',
                  value: 1
                },
                {
                  label: '3-6个月',
                  value: 2
                },
                {
                  label: '6-12个月',
                  value: 3
                },
                {
                  label: '1-3年以上',
                  value: 4
                },
                {
                  label: '3年以上',
                  value: 5
                }
              ],
          },
          {
            type: 0,
            index: 3,
            need: false,
            title: "您如何学习编程?",
          },
          {
            type: 0,
            index: 4,
            need: true,
            title: "您学习的方向是?",
          },
          {
            type: 0,
            index: 5,
            need: true,
            title: "您为什么要学习编程?",
          },
          {
            type: 0,
            index: 6,
            need: false,
            title: "您的联系方式?",
          },
          {
            type: 1,
            index: 7,
            need: false,
            title: "您希望订阅我们的信息吗?",
            options: [
              {label: "是", value: true},
              {label: "否", value: false}
            ]
          },
        ]
      },
      answer: [],
      submitted: 0,
      res: null
    }
  },
  async created() {
    //鉴权
    // var res = await getSurvey({id: this.$route.params.token})
    // this.surveyData = res.data
  }
  ,
  filters: {
    formatIndex: function (index) {
      if (index < 10) return '0' + index
      return index
    }
  }
  ,
  methods: {
    submit() {
      this.submitted = -1
      setTimeout(() => {
        this.submitted = 1
      }, 1000)
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

}

.paper-time {
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
