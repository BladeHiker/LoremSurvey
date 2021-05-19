<template>
  <div>
    <q-tabs
      v-model="tab"
      class="text-teal shadow-2 bg-grey-1"
    >
      <q-tab name="edit" icon="edit" label="编辑"/>
      <q-tab name="send" icon="share" label="发布"/>
      <q-tab name="response" icon="equalizer" label="结果"/>
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="edit" class="column">
        <q-btn-group spread flat>
          <q-btn label="选择题" icon="check_box"/>
          <q-btn label="填空题" icon="question_answer"/>
          <q-btn label="预览" icon="visibility" @click="paperSimulate=true"/>
          <q-btn label="保存" icon="save" @click="onSave"/>
        </q-btn-group>
        <div class="column flex-center">
          <div class="san-grail">
            <div class="q-ma-lg">
              <div class="paper-header">
                <div class="text-h4 editable text-center paper-title">
                  {{ surveyData.title }}
                  <q-popup-edit v-model="surveyData.title" title="编辑标题" buttons>
                    <q-input v-model="surveyData.title" placeholder="请输入问卷标题" maxlength="50" dense autofocus counter/>
                  </q-popup-edit>
                </div>
                <br>
                <div class="text-center editable">
                  <div v-html="surveyData.desc"></div>
                  <q-popup-edit v-model="surveyData.desc" title="编辑描述" buttons>
                    <q-editor v-model="surveyData.desc" dense autofocus counter/>
                  </q-popup-edit>
                </div>
              </div>
              <div class="column">
                <div v-for="(problem,i) in surveyData.problemSet" :key="i" class="ques-section">
                  <div v-if="problem.type===0">
                    <div v-if="editing!==i" @click="editing=i" class="editable">
                      <div class="text-h6 ques-title-large">
                        <b>{{ i + 1|formatIndex }} / </b>
                        <span>{{ problem.title }}</span>
                        <span v-if="problem.need" class="text-red"> *</span>
                      </div>
                      <q-input placeholder="请输入"
                               disable
                               :dense="true"
                               filled
                               v-model="answer[i]"
                      />
                    </div>
                    <div v-if="editing===i"></div>

                  </div>
                  <div v-else-if="problem.type===1">
                    <div class="editable">
                      <div class="text-h6 ques-title">
                        <b>{{ i + 1 |formatIndex }} / </b>
                        <span>{{ problem.title }}</span>
                        <span v-if="problem.need" class="text-red"> *</span>
                      </div>
                      <q-field
                        v-model="answer[i]"
                        borderless
                        disable
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="send">
        <div class="q-pa-md">
          <q-table
            title="受访者"
            :data="respondentData"
            :columns="columns"
            row-key="name"
            :selected-rows-label="getSelectedString"
            selection="multiple"
            :selected.sync="selected"
          >
            <template v-slot:top-right>
              <div class="flex row">
                <q-space style="width: 10px"/>
                <q-btn color="primary" :disable="selected.length===0" @click="onSend">发送问卷
                </q-btn>
              </div>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
      <q-tab-panel name="response">123</q-tab-panel>
    </q-tab-panels>

    <div class="simulatorFixed" v-if="paperSimulate">
      <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders simulatorWindow">
        <q-header elevated>
          <q-bar>
            <q-icon name="description"/>
            <div>问卷预览</div>
            <q-space/>
            <q-btn dense flat icon="close" @click="hideSimulate"/>
          </q-bar>

        </q-header>

        <q-page-container style="background-color: #F2F2F2">
          <q-page class="column flex-center main-bg">
            <Survey/>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </div>
</template>

<script>
import Survey from "pages/Survey";
import {getSurveyRespondentList, sendSurveyToRespondents} from "src/api/surveyAdmin";

export default {
  name: "Edit",
  data() {
    return {
      paperSimulate: false,
      tab: 'edit',
      templateProblem: [
        {
          type: 1,
          index: 1,
          need: true,
          title: "单击编辑问题",
          options: [
            {label: '在校学生', value: 1},
          ]
        }
      ],
      surveyData: {
        title: "无标题问卷",
        stime: "开始时间",
        etime: "截止时间",
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
      editing: null,
      respondentData: [],
      id: this.$route.params.id,
      selected: [],
      columns: [
        {
          name: 'id',
          required: true,
          label: '学号/工号',
          field: 'id',
          sortable: true
        },
        {name: 'name', label: '姓名', field: 'name', sortable: true},
        {name: 'school', label: '学校', field: 'school', sortable: true},
        {name: 'sex', label: '性别', field: 'sex'},
        {name: 'phone', label: '手机号', field: 'phone'},
        {name: 'email', label: '邮箱', field: 'email'},
        {name: 'status', label: '状态', field: 'status', format: val => val === 0 ? "未发送" : "已发送"},
      ],
    }
  },
  created() {
    getSurveyRespondentList({id: this.id}).then(res => {
      this.respondentData = res.data
    })
  },
  components: {Survey},
  filters: {
    formatIndex: function (index) {
      if (index < 10) return '0' + index
      return index
    }
  },
  methods: {
    hideSimulate() {
      this.paperSimulate = false
    },
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.respondentData.length}`
    },
    onSave() {

    },
    onSend() {
      let sendList = []
      for (let i = 0; i < this.selected.length; i++) {
        sendList.push(this.selected[i].id)
      }
      sendSurveyToRespondents({id: this.id, userlist: sendList})
    }
  }
}
</script>

<style scoped>
.main-bg {
  background-color: #F2F2F2;
  overflow: hidden;
}

.simulatorWindow {
  height: calc(100vh - 60px);
  margin-top: 55px;
  width: min(1000px, 95vw);
}

.simulatorFixed {
  background-color: rgba(170, 170, 170, 0.6);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.paper-header {
  padding-top: 50px;
  padding-bottom: 20px;
  max-width: min(100vw, 800px);
  max-width: 100%;
  word-wrap: anywhere;
}

.editable:hover {
  cursor: pointer;
  /*border: 1px black solid;*/
  /*margin: -1px;*/
  background-color: #E6E6E650;
}

/*.paper-header .editable:hover::after {*/
/*  content: "单击编辑";*/
/*  font-size: small;*/
/*  color: #26A69A;*/
/*  position: absolute;*/
/*}*/

.ques-title {
  margin-bottom: 8px;
}

.ques-title-large {
  margin-bottom: 20px;
}

.ques-section {
  margin: 15px 0;
}
</style>
