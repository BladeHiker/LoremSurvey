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
      <q-route-tab :to="{ }" name="edit" icon="edit" label="编辑"/>
      <q-route-tab :to="{ query: { tab: '2' } }" name="send" icon="share" label="发布"/>
      <q-route-tab :to="{ query: { tab: '3' } }" name="response" icon="equalizer" label="结果"/>
      <q-route-tab :to="{ query: { tab: '4' } }" name="setting" icon="settings" label="设置"/>
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
                    <div v-if="editing!==pid" @click="editing=pid;isEditing=true" class="editable">
                      <div class="text-h6 ques-title-large">
                        <b>{{ pid + 1|formatIndex }} / </b>
                        <span v-if="problem.title!==''">{{ problem.title }}</span>
                        <span v-else class="text-green-5"><i>点击编辑问题</i></span>
                        <span v-if="problem.need" class="text-red"> *</span>
                      </div>
                      <q-input placeholder="请输入"
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
                    <div class="editable" @click="editing=pid;isEditing=true" v-if="editing!==pid">
                      <div class="text-h6 ques-title">
                        <b>{{ pid + 1 |formatIndex }} / </b>
                        <span v-if="problem.title!==''">{{ problem.title }}</span>
                        <span v-else class="text-green-5"><i>点击编辑问题</i></span>
                        <span v-if="problem.need" class="text-red"> *</span>
                      </div>
                      <q-field
                        borderless
                        v-model="answer[pid]"
                      >
                        <template v-slot:control>
                          <q-option-group
                            :options="problem.options"
                            color="primary"
                            type="radio"
                            v-model="answer[pid]"
                            @input="answer[pid]=null"
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
                              <input v-model="item.label" @change="item.value=item.label" class="input-option"
                                     placeholder="输入选项"/>
                            </div>
                          </q-item-section>
                          <q-item-section side>
                            <div class="text-grey-8 q-gutter-xs">
                              <q-btn style="display: inline !important;" class="gt-xs" size="12px" flat dense
                                     icon="delete"
                                     @click="delOption(pid,i)"/>
                              <q-btn size="12px" flat dense icon="arrow_upward" @click="upOption(pid,i)"/>
                              <q-btn size="12px" flat dense icon="arrow_downward" @click="downOption(pid,i)"/>
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-separator/>
                        <q-item style="border: 2px black solid;border-radius: 0 0 4px 4px">
                          <q-item-section>
                            <div>
                              <q-icon size="12px" style="width: 25px" name="create"/>
                              <input autofocus="autofocus" v-model="templateOptions.label"
                                     class="input-option add-option"
                                     placeholder="添加选项" @keyup.enter="addOption(pid)"/>
                            </div>
                          </q-item-section>
                          <q-item-section side>
                            <div class="text-grey-8 q-gutter-xs">
                              <q-btn class="gt-xs" style="display: inline !important;" size="12px" flat dense round
                                     icon="add" @click="addOption(pid)"/>
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
          <q-banner v-if="!surveyData.running" class="bg-grey-3" rounded style="margin-bottom: 10px">
            <template v-slot:avatar>
              <q-icon name="speaker_notes_off" color="primary"/>
            </template>
            当前问卷已停止收集，受访者无法填写问卷。
            <template v-slot:action>
              <q-btn flat color="primary" @click="tab='setting'" label="改变问卷设置"/>
            </template>
          </q-banner>
          <q-banner v-if="!surveyData.open" class="bg-primary text-white" rounded>
            <template v-slot:avatar>
              <q-icon name="group_add"/>
            </template>
            此问卷是定向问卷，请选择在列表在选择受访者。
            <template v-slot:action>
              <q-btn flat color="white" @click="routeTo('/manage/respondents')" label="管理受访者↗"/>
              <q-btn flat color="white" @click="tab='setting'" label="改变问卷访问权限"/>
            </template>
          </q-banner>
          <q-banner v-else class="bg-secondary text-white" rounded>
            <template v-slot:avatar>
              <q-icon name="wifi_tethering"/>
            </template>
            此问卷是开放问卷，可使用如下链接匿名作答。
            <q-card class="q-mt-sm q-pa-md text-center text-italic" flat>
              <a :href="openLink" class="q-link text-blue-7">{{ openLink }}</a>
            </q-card>
            <template v-slot:action>
              <q-btn flat color="white" @click="routeTo('/manage/respondents')" label="管理受访者↗"/>
              <q-btn flat color="white" @click="tab='setting'" label="改变问卷访问权限"/>
            </template>
          </q-banner>
          <br/>
          <div>
            <q-table
              title="分发问卷"
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
      <q-tab-panel name="response">
        <div class="column flex-center">
          <div class="san-grail">
            <div class="q-ma-lg">
              <div class="paper-header">
                <div class="text-h4 text-center paper-title">
                  <span v-if="surveyData.title!==''">{{ surveyData.title }}</span>
                  <span v-else class="text-green-5"><i>无标题问卷</i></span>
                </div>
                <br>
                <q-card>
                  <q-card-section horizontal class="flex row flex-center justify-around q-pa-md">
                    <q-card-section class="flex flex-center column">
                      <div class="text-h5 text-blue-7">{{ resultData.frequency ? resultData.frequency : '-' }}</div>
                      <div>已收集问卷</div>
                    </q-card-section>
                    <q-card-section class="flex flex-center column">
                      <div class="text-h5 text-blue-7" v-if="surveyData.running">
                        {{ surveyData.open ? '开放收集中' : "定向收集中" }}
                      </div>
                      <div class="text-h5 text-brown-5" v-else>
                        停止收集
                      </div>
                      <div>当前状态</div>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>
              <div class="column">
                <div v-for="(problem,pid) in resultData.problemSet" :key="pid" class="ques-section">
                  <div v-if="problem.type===0">
                    <div>
                      <div class="text-h6 ques-title-large">
                        <b>{{ pid + 1|formatIndex }} / </b>
                        <span v-if="problem.title!==''">{{ problem.title }}</span>
                        <span v-else class="text-green-5"><i>无标题</i></span>
                        <span v-if="problem.need" class="text-red"> *</span>
                      </div>
                      <q-list bordered separator>
                        <q-item v-for="(ans,cnt) in problem.answer" :key="ans">
                          <q-item-section>{{ ans }}</q-item-section>
                          <q-item-section side>
                            <div class="text-grey-8 q-gutter-xs">
                              {{ cnt }}
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-item v-if="!problem.frequency || problem.frequency===0">
                          <div class="q-ma-sm">
                            <q-icon name="warning"/>
                            <span>&nbsp;&nbsp;暂无作答</span>
                          </div>
                        </q-item>
                      </q-list>

                    </div>
                  </div>
                  <div v-else-if="problem.type===1">
                    <div>
                      <div class="text-h6 ques-title">
                        <b>{{ pid + 1 |formatIndex }} / </b>
                        <span v-if="problem.title!==''">{{ problem.title }}</span>
                        <span v-else class="text-green-5"><i>无标题</i></span>
                        <span v-if="problem.need" class="text-red"> *</span>
                      </div>
                      <q-list bordered separator>
                        <q-item v-for="(option,i) in problem.options" :key="i">
                          <q-item-section>
                            {{ option.label }}
                            <q-linear-progress :value="problem.frequency? option.frequency/problem.frequency:0"/>
                          </q-item-section>
                          <q-item-section side>
                            <div class="text-grey-8 q-gutter-xs">
                              {{ option.frequency }}
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-item v-if="problem.options.length===0">
                          <div class="q-ma-sm">
                            <q-icon name="warning"/>
                            <span>&nbsp;&nbsp;未设置选项</span>
                          </div>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="setting">
        <div class="flex justify-center">
          <q-list bordered separator class="san-grail">
            <q-item>
              <q-item-section>{{ surveyData.running ? '允许作答' : '停止收集问卷' }}</q-item-section>
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-toggle v-model="surveyData.running" @input="onSave"/>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>{{ surveyData.open ? "开放问卷 (收到链接者均可作答)" : "定向问卷 (仅受邀用户可以作答)" }}</q-item-section>
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-toggle v-model="surveyData.open" @input="onSave"/>
                </div>
              </q-item-section>
            </q-item>
            <q-item v-if="false">
              <q-item-section>开放时间</q-item-section>
              <q-item-section v-if="surveyData.startTime">
                <q-input filled v-model="surveyData.startTime">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item-section>
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-toggle v-model="startTimeEnable" @click="switchStime" @input="onSave"/>

                </div>
              </q-item-section>

            </q-item>
          </q-list>
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
import {
  getOpenSurveyLink,
  getSurveyItem,
  getSurveyRespondentList, getSurveyResult,
  modifySurveyItem,
  sendSurveyToRespondents
} from "src/api/surveyAdmin";
import {Notify} from "quasar";

export default {
  name: "Edit",
  data() {
    return {
      paperSimulate: false,
      tab: 'edit',
      templateOptions: {label: "", value: null},
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
      isEditing: false,
      openLink: null,
      resultData: {
        frequency: '-',
        problemSet: [],
        desc: "",
        id: "",
        open: null,
        respondent_ids: [],
        startTime: null
      }
    }
  },
  async created() {
    await this.getSurveyData()
    await this.getRespondentList()
    await this.getResponse()
  },
  components: {Survey},
  filters: {
    formatIndex: function (index) {
      if (index < 10) return '0' + index
      return index
    }
  },
  computed: {
    startTimeEnable() {
      return this.surveyData.startTime !== null
    }
  },
  methods: {
    async getResponse() {
      const res = await getSurveyResult({id: this.id})
      this.resultData = res.data.data
      this.resultData.problemSet.sort((a, b) => {
        return a.index > b.index ? 1 : -1
      })
    },
    switchStime() {

    },
    upProblem(pid) {
      if (pid) {
        const t = this.surveyData.problemSet[pid - 1].index
        this.surveyData.problemSet[pid - 1].index = this.surveyData.problemSet[pid].index
        this.surveyData.problemSet[pid].index = t
        this.sortProblems()
        --this.editing
      }
    }
    ,
    downProblem(pid) {
      if (pid + 1 !== this.surveyData.problemSet.length) {
        const t = this.surveyData.problemSet[pid].index
        this.surveyData.problemSet[pid].index = this.surveyData.problemSet[pid + 1].index
        this.surveyData.problemSet[pid + 1].index = t
        this.sortProblems()
        ++this.editing
      }
    }
    ,
    delProblem(pid) {
      console.log(pid)
      for (let i = pid; i < this.surveyData.problemSet.length - 1; ++i) {
        this.surveyData.problemSet[i] = this.surveyData.problemSet[i + 1]
        this.surveyData.problemSet[i].index = i + 1
      }
      this.editing = -1
      this.surveyData.problemSet.splice(this.surveyData.problemSet.length - 1, 1)
    }
    ,
    upOption(pid, oid) {
      if (oid > 0) {
        const t = this.surveyData.problemSet[pid].options[oid - 1].value
        this.surveyData.problemSet[pid].options[oid - 1].value = this.surveyData.problemSet[pid].options[oid].value
        this.surveyData.problemSet[pid].options[oid].value = t
        this.surveyData.problemSet[pid].options.sort((a, b) => {
          return a.value < b.value ? 1 : -1
        })
      }
    }
    ,
    downOption(pid, oid) {
      if (this.surveyData.problemSet[pid].options.length > oid + 1) {
        const t = this.surveyData.problemSet[pid].options[oid + 1].value
        this.surveyData.problemSet[pid].options[oid + 1].value = this.surveyData.problemSet[pid].options[oid].value
        this.surveyData.problemSet[pid].options[oid].value = t
        this.surveyData.problemSet[pid].options.sort((a, b) => {
          return a.value < b.value ? 1 : -1
        })
      }
    }
    ,
    delOption(pid, oid) {
      for (let i = oid; i < this.surveyData.problemSet[pid].options.length - 1; ++i) {
        this.surveyData.problemSet[pid].options[i] = this.surveyData.problemSet[pid].options[i + 1]
      }
      this.surveyData.problemSet[pid].options.splice(this.surveyData.problemSet[pid].options.length - 1, 1)
    }
    ,
    addOption(pid) {
      this.surveyData.problemSet[pid].options.push({
        label: this.templateOptions.label,
        value: this.templateOptions.label
      })
      this.templateOptions.label = ""
    }
    ,
    changeData() {
      this.isEditing = true
    }
    ,
    prepareData() {
      switch (this.tab) {
        case "send":
          this.getRespondentList()
          break;
        case "response":
          this.getResponse()
          break
        case "setting":
      }
      if (this.isEditing) this.onSave()
    }
    ,
    sortProblems() {
      this.surveyData.problemSet.sort((a, b) => {
        return a.index > b.index ? 1 : -1
      })
    }
    ,
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
    }
    ,
    async getRespondentList() {
      const res = await getSurveyRespondentList({id: this.id})
      this.respondentData = res.data.data
      if (this.surveyData.open) {
        const link = await getOpenSurveyLink({id: this.id, userList: []})
        this.openLink = link.data.data.link
      }
    }
    ,
    routeTo(url) {
      this.$router.push(url)
    }
    ,
    hideSimulate() {
      this.paperSimulate = false
    }
    ,
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.respondentData.length}`
    }
    ,
    onSave() {
      this.editing = -1
      this.surveyData.id = this.id
      modifySurveyItem(this.surveyData).then(res => {
        if (res && res.data && res.data.code === 0) {
          this.isEditing = false
          Notify.create({message: "保存成功", color: 'secondary', position: 'top', timeout: 1500})
          this.getSurveyData()
        }
      })
    }
    ,
    onSend() {
      let sendList = []
      for (let i = 0; i < this.selected.length; i++) {
        sendList.push(this.selected[i].id)
      }
      sendSurveyToRespondents({id: this.id, userList: sendList}).then(() => {
        Notify.create({message: "发送成功", color: 'secondary', position: 'top', timeout: 1500})
        this.getRespondentList()
      })
    }
    ,
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
    }
    ,
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
  width: calc(100% - 40px);
  border-bottom: #1976D2 dashed 1px;
}

.add-option {
  border-bottom: none;
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
