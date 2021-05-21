<template>
  <div>
    <q-toolbar class="bg-blue-grey-1 flex flex-center text-teal">
      <q-icon name="description"/>
      &nbsp;
      <div class="text-weight-bold edit-title" v-if="surveyData.title!==''">
        {{ surveyData.title }}
      </div>
      <div class="text-weight-bold edit-title" v-else>
        <i>无标题问卷</i>
      </div>
      <span v-if="isEditing"> &nbsp;-&nbsp;正在编辑</span>
      <span v-else> &nbsp;-&nbsp;已保存</span>
    </q-toolbar>
    <q-tabs
      v-model="tab"
      class="text-teal shadow-2 bg-grey-1"
      shrink
      stretch
      inline-label
    >
      <q-tab name="edit" icon="edit" label="编辑"/>
      <q-tab name="send" icon="share" label="发布"/>
      <q-tab name="response" icon="equalizer" label="结果"/>
      <q-tab name="setting" icon="settings" label="设置"/>
    </q-tabs>
    <q-tab-panels v-model="tab" @transition="prepareData" animated>
      <q-tab-panel name="edit" class="column">
        <div class="column flex-center">
          <div class="san-grail">
            <div class="q-ma-lg">
              <div class="paper-header">
                <div class="text-h4 editable text-center paper-title">
                  <span v-if="surveyData.title!==''">{{ surveyData.title }}</span>
                  <span v-else class="text-green-5"><i>点击设置标题</i></span>
                  <q-popup-edit v-model="surveyData.title" title="编辑标题" buttons @input="changeData" @save="changeData">
                    <q-input v-model="surveyData.title" placeholder="请输入问卷标题"
                             :rules="[val=>val&&val!==''||'请输入标题']"
                             maxlength="50" dense autofocus counter/>
                  </q-popup-edit>
                </div>
                <br>
                <div class="text-center editable">
                  <span v-if="surveyData.desc!==''" v-html="surveyData.desc"></span>
                  <span v-else class="text-green-5"><i>点击添加问卷说明</i></span>
                  <q-popup-edit v-model="surveyData.desc" title="编辑描述" buttons @save="changeData">
                    <q-editor v-model="surveyData.desc" dense autofocus counter/>
                  </q-popup-edit>
                </div>
              </div>
              <div class="column">
                <div v-for="(problem,pid) in surveyData.problemSet" :key="pid" class="ques-section">
                  <div v-if="problem.type===0">
                    <div v-if="editing!==pid" @click="editing=pid" class="editable">
                      <div class="text-h6 ques-title-large">
                        <b>{{ pid + 1|formatIndex }} / </b>
                        <span v-if="problem.title!==''">{{ problem.title }}</span>
                        <span v-else class="text-green-5"><i>点击编辑问题</i></span>
                        <span v-if="problem.need" class="text-red"> *</span>
                      </div>
                      <q-input placeholder="请输入"
                               disable
                               :dense="true"
                               filled
                               v-model="answer[pid]"
                      />
                    </div>
                    <div v-if="editing===pid">
                      <div class="text-h6 ques-title-large">
                        <b>{{ pid + 1|formatIndex }} / </b>
                        <input v-model="problem.title" placeholder="输入问题" minlength="1" maxlength="128"
                               class="input-title"/>
                        <span v-if="problem.need" class="text-red"> *</span>
                        <div class="text-grey-8 q-gutter-xs text-right text-body1 question-btn">
                          <q-toggle label="必填项" dense v-model="problem.need"/>
                          <q-btn flat dense icon="arrow_upward" label="上移" @click="upProblem(pid)"/>
                          <q-btn flat dense icon="arrow_downward" label="下移" @click="downProblem(pid)"/>
                          <q-btn flat dense icon="close" label="删除" @click="delProblem(pid)"/>
                          <q-btn flat dense icon="check" label="完成" @click="editing=-1"/>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div v-else-if="problem.type===1">
                    <div class="editable" @click="editing=pid" v-if="editing!==pid">
                      <div class="text-h6 ques-title">
                        <b>{{ pid + 1 |formatIndex }} / </b>
                        <span v-if="problem.title!==''">{{ problem.title }}</span>
                        <span v-else class="text-green-5"><i>点击编辑问题</i></span>
                        <span v-if="problem.need" class="text-red"> *</span>
                      </div>
                      <q-field
                        v-model="answer[pid]"
                        borderless
                        disable
                      >
                        <template v-slot:control>
                          <q-option-group
                            v-model="answer[pid]"
                            :options="problem.options"
                            color="primary"
                            type="radio"
                          />
                        </template>
                      </q-field>
                    </div>
                    <div v-else>
                      <div class="text-h6 ques-title">
                        <b>{{ pid + 1 |formatIndex }} / </b>
                        <input v-model="problem.title" placeholder="输入问题" minlength="1" maxlength="128"
                               class="input-title"/>
                        <span v-if="problem.need" class="text-red"> *</span>
                        <div class="text-grey-8 q-gutter-xs text-right text-body1 question-btn">
                          <q-toggle label="必填项" dense v-model="problem.need"/>
                          <q-btn flat dense icon="arrow_upward" label="上移" @click="upProblem(pid)"/>
                          <q-btn flat dense icon="arrow_downward" label="下移" @click="downProblem(pid)"/>
                          <q-btn flat dense icon="close" label="删除" @click="delProblem(pid)"/>
                          <q-btn flat dense icon="check" label="完成" @click="editing=-1"/>
                        </div>
                      </div>
                      <q-list bordered class="rounded-borders">
                        <q-item-label header>选项列表</q-item-label>
                        <q-separator/>
                        <q-item v-if="problem.options.length===0">
                          <div class="q-ma-sm">
                            <q-icon name="warning"/>
                            <span>&nbsp;请添加选项</span>
                          </div>
                        </q-item>
                        <q-item v-for="(item,i) in problem.options" :key="i">
                          <q-item-section>
                            <div>
                              <q-chip dense square>{{ i + 1 }}</q-chip>
                              <input v-model="item.label" class="input-option" placeholder="输入选项"/>
                            </div>
                          </q-item-section>
                          <q-item-section top side>
                            <div class="text-grey-8 q-gutter-xs">
                              <q-btn class="gt-xs" size="12px" flat dense icon="delete"
                                     @click="delOption(pid,i)"/>
                              <q-btn size="12px" flat dense icon="arrow_upward" @click="upOption(pid,i)"/>
                              <q-btn size="12px" flat dense icon="arrow_downward" @click="downOption(pid,i)"/>
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-separator/>
                        <q-item>
                          <q-item-section>
                            <div>
                              <q-icon size="12px" style="width: 25px" name="create"/>
                              <input v-model="templateOptions.label" class="input-option" placeholder="添加选项"/>
                            </div>
                          </q-item-section>
                          <q-item-section top side>
                            <div class="text-grey-8 q-gutter-xs">
                              <q-btn class="gt-xs" size="12px" flat dense round icon="add" @click="addOption(pid)"/>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-footer v-show="!paperSimulate" elevated>
          <q-btn-group spread flat>
            <q-btn label="添加选择题" icon="check_box" @click="addChoiceQuestion"/>
            <q-btn label="添加填空题" icon="question_answer" @click="addBlankQuestion"/>
            <q-btn label="预览" icon="visibility" @click="paperSimulate=true"/>
            <q-btn label="保存" icon="save" @click="onSave"/>
          </q-btn-group>
        </q-footer>
      </q-tab-panel>
      <q-tab-panel name="send" class="column">
        <div style="max-width: calc(100vw - 32px);">
          <q-banner class="bg-primary text-white" rounded>
            此问卷是定向问卷，请选择在列表在选择受访者。
            <template v-slot:action>
              <q-btn flat color="white" @click="routeTo('/manage/respondents')" label="管理受访者↗"/>
              <q-btn flat color="white" @click="tab='setting'" label="改变问卷访问权限"/>
            </template>
          </q-banner>
          <br/>
          <div>
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
                  <q-btn color="primary" :disable="selected.length===0" @click="onSend">发送问卷
                  </q-btn>
                </div>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="response">123</q-tab-panel>
      <q-tab-panel name="setting">
        <div>
          <q-toggle v-model="surveyData.isrunning" label="允许作答"/>
        </div>
      </q-tab-panel>
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
            <Survey :sdata="surveyData"/>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </div>
</template>

<script>
import Survey from "pages/Survey";
import {getSurveyItem, getSurveyRespondentList, modifySurveyItem, sendSurveyToRespondents} from "src/api/surveyAdmin";
import {Notify} from "quasar";

export default {
  name: "Edit",
  data() {
    return {
      paperSimulate: false,
      tab: 'edit',
      templateOptions: {label: "", value: null},
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
      // surveyData: {
      //   title: "无标题问卷",
      //   stime: "开始时间",
      //   etime: "截止时间",
      //   desc: "沈阳航空航天大学 软件工程LoremIpsum Team 调查问卷",
      //   problemSet: [
      //     {
      //       type: 1,
      //       index: 1,
      //       need: true,
      //       title: "您目前的职业是?",
      //       options: [
      //         {label: '在校学生', value: 1},
      //         {label: '政府/机关干部/公务员', value: 2},
      //         {label: '企业管理者（包括基层及中高层管理者）', value: 3},
      //         {
      //           label: '普通职员（办公室 / 写字楼工作人员）', value: 4
      //         },
      //         {label: '专业人员（如医生 / 律师 / 文体 / 记者 / 老师等）', value: 5},
      //         {label: '普通工人（如工厂工人 / 体力劳动者等）', value: 6},
      //         {
      //           label: '商业服务业职工（如销售人员 / 商店职员 / 服务员等）', value: 7
      //         },
      //         {label: '个体经营者 / 承包商', value: 8},
      //         {label: '自由职业者', value: 9},
      //         {label: '农林牧渔劳动者', value: 10},
      //         {
      //           label: '退休',
      //           value: 11
      //         },
      //         {label: '暂无职业', value: 12}
      //       ],
      //     },
      //     {
      //       type: 1,
      //       index: 2,
      //       need: true,
      //       title: "您学习编程多久了?",
      //       options:
      //         [
      //           {
      //             label: '不到3个月',
      //             value: 1
      //           },
      //           {
      //             label: '3-6个月',
      //             value: 2
      //           },
      //           {
      //             label: '6-12个月',
      //             value: 3
      //           },
      //           {
      //             label: '1-3年以上',
      //             value: 4
      //           },
      //           {
      //             label: '3年以上',
      //             value: 5
      //           }
      //         ],
      //     },
      //     {
      //       type: 0,
      //       index: 3,
      //       need: false,
      //       title: "您如何学习编程?",
      //     },
      //     {
      //       type: 0,
      //       index: 4,
      //       need: true,
      //       title: "您学习的方向是?",
      //     },
      //     {
      //       type: 0,
      //       index: 5,
      //       need: true,
      //       title: "您为什么要学习编程?",
      //     },
      //     {
      //       type: 0,
      //       index: 6,
      //       need: false,
      //       title: "您的联系方式?",
      //     },
      //     {
      //       type: 1,
      //       index: 7,
      //       need: false,
      //       title: "您希望订阅我们的信息吗?",
      //       options: [
      //         {label: "是", value: true},
      //         {label: "否", value: false}
      //       ]
      //     },
      //   ]
      // },
      surveyData: {
        title: "",
        desc: "",
        problemSet: []
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
      isEditing: false
    }
  },
  async created() {
    await this.getSurveyData()
    await this.getRespondentList()
  },
  components: {Survey},
  filters: {
    formatIndex: function (index) {
      if (index < 10) return '0' + index
      return index
    }
  },
  methods: {
    upProblem(pid) {
      if (pid) {
        const t = this.surveyData.problemSet[pid - 1].index
        this.surveyData.problemSet[pid - 1].index = this.surveyData.problemSet[pid].index
        this.surveyData.problemSet[pid].index = t
        this.sortProblems()
        --this.editing
      }
    },
    downProblem(pid) {
      if (pid + 1 !== this.surveyData.problemSet.length) {
        const t = this.surveyData.problemSet[pid].index
        this.surveyData.problemSet[pid].index = this.surveyData.problemSet[pid + 1].index
        this.surveyData.problemSet[pid + 1].index = t
        this.sortProblems()
        ++this.editing
      }
    },
    delProblem(pid) {
      console.log(pid)
      for (let i = pid; i < this.surveyData.problemSet.length - 1; ++i) {
        this.surveyData.problemSet[i] = this.surveyData.problemSet[i + 1]
        this.surveyData.problemSet[i].index = i + 1
      }
      this.editing = -1
      this.surveyData.problemSet.splice(this.surveyData.problemSet.length - 1, 1)
    },
    upOption(pid, oid) {
      if (oid > 0) {
        const t = this.surveyData.problemSet[pid].options[oid - 1].value
        this.surveyData.problemSet[pid].options[oid - 1].value = this.surveyData.problemSet[pid].options[oid].value
        this.surveyData.problemSet[pid].options[oid].value = t
        this.surveyData.problemSet[pid].options.sort((a, b) => {
          return a.value < b.value ? 1 : -1
        })
      }
    },
    downOption(pid, oid) {
      if (this.surveyData.problemSet[pid].options.length > oid + 1) {
        const t = this.surveyData.problemSet[pid].options[oid + 1].value
        this.surveyData.problemSet[pid].options[oid + 1].value = this.surveyData.problemSet[pid].options[oid].value
        this.surveyData.problemSet[pid].options[oid].value = t
        this.surveyData.problemSet[pid].options.sort((a, b) => {
          return a.value < b.value ? 1 : -1
        })
      }
    },
    delOption(pid, oid) {
      for (let i = oid; i < this.surveyData.problemSet[pid].options.length - 1; ++i) {
        this.surveyData.problemSet[pid].options[i] = this.surveyData.problemSet[pid].options[i + 1]
      }
      this.surveyData.problemSet[pid].options.splice(this.surveyData.problemSet[pid].options.length - 1, 1)
    },
    addOption(pid) {
      this.surveyData.problemSet[pid].options.push({
        label: this.templateOptions.label,
        value: this.surveyData.problemSet[pid].options.length + 1
      })
      this.templateOptions.label = ""
    },
    changeData() {
      this.isEditing = true
    },
    prepareData() {
      switch (this.tab) {
        case "send":
          this.getRespondentList()
      }
    },
    sortProblems() {
      this.surveyData.problemSet.sort((a, b) => {
        return a.index > b.index ? 1 : -1
      })
    },
    async getSurveyData() {
      const res = await getSurveyItem({id: this.id})
      this.surveyData = res.data.data
      this.sortProblems()
      for (let i = 0; i < this.surveyData.problemSet.length; i++) {
        if (this.surveyData.problemSet[i].type === 1) {
          this.surveyData.problemSet[i].options.sort((a, b) => {
            return a.value < b.value ? 1 : -1
          })
        }
      }
    },
    async getRespondentList() {
      const res = await getSurveyRespondentList({id: this.id})
      this.respondentData = res.data.data
    },
    routeTo(url) {
      this.$router.push(url)
    },
    hideSimulate() {
      this.paperSimulate = false
    },
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.respondentData.length}`
    },
    onSave() {
      this.editing = -1
      this.surveyData.id = this.id
      modifySurveyItem(this.surveyData).then(res => {
        if (res.data.code === 0) {
          this.isEditing = false
          Notify.create({message: "保存成功", color: 'secondary', position: 'top', timeout: 1500})
        }
      })
    },
    onSend() {
      let sendList = []
      for (let i = 0; i < this.selected.length; i++) {
        sendList.push(this.selected[i].id)
      }
      sendSurveyToRespondents({id: this.id, userlist: sendList}).then(() => {
        Notify.create({message: "发送成功", color: 'secondary', position: 'top', timeout: 1500})
        this.getRespondentList()
      })
    },
    addChoiceQuestion() {
      this.surveyData.problemSet.push({
          type: 1,
          index: this.surveyData.problemSet.length + 1,
          need: false,
          title: "",
          desc: "",
          options: [],
        }
      )
    },
    addBlankQuestion() {
      this.surveyData.problemSet.push({
        type: 0,
        index: this.surveyData.problemSet.length + 1,
        need: false,
        title: "",
        desc: ""
      },)
    }
  }
}
</script>

<style scoped>
.question-btn {
  padding-right: 16px;
}

.input-title {
  outline: none;
  width: calc(100% - 60px);
  border: none;
  border-bottom: #1976D2 dashed 1px;
}

.input-option {
  border: none;
  outline: none;
  width: calc(100% - 30px);
}

.edit-title {
  font-size: 18px;
  letter-spacing: 1px;
}

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
