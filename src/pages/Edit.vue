<template>
  <div>
    <!--    <q-toolbar class="bg-blue-grey-1 flex flex-center text-teal">-->
    <!--      <q-icon name="description"/>-->
    <!--      &nbsp;-->
    <!--      <div class="text-weight-bold edit-title" v-if="surveyData.title!==''">-->
    <!--        {{ surveyData.title }}-->
    <!--      </div>-->
    <!--      <div class="text-weight-bold edit-title" v-else>-->
    <!--        <i>无标题问卷</i>-->
    <!--      </div>-->
    <!--      <span v-if="isEditing"> &nbsp;-&nbsp;正在编辑</span>-->
    <!--      <span v-else> &nbsp;-&nbsp;已保存</span>-->
    <!--    </q-toolbar>-->
    <q-footer v-show="!paperSimulate" elevated>
      <q-tabs
        v-model="tab"
        class="shadow-2 bg-primary"
        shrink
        stretch
        inline-label
      >
        <q-route-tab :to="{ }" name="edit" icon="edit" label="编辑" replace/>
        <q-route-tab :to="{ query: { tab: '2' } }" name="send" icon="share" label="发布" replace/>
        <q-route-tab :to="{ query: { tab: '3' } }" name="response" icon="equalizer" label="结果" replace/>
        <q-route-tab :to="{ query: { tab: '4' } }" name="setting" icon="settings" label="设置" replace/>
      </q-tabs>
    </q-footer>
    <q-tab-panels v-model="tab" @transition="prepareData" animated>
      <q-tab-panel name="edit" class="column">
        <div class="column flex-center">
          <div class="san-grail">
            <div class="q-ma-lg">
              <q-banner dense inline-actions class="text-white bg-red q-mb-md" v-if="voidSurvey">
                此问卷不包含题目！
                <template v-slot:avatar>
                  <q-icon name="warning" color="white"/>
                </template>
              </q-banner>

              <!--              <q-banner dense inline-actions class="text-white bg-orange q-mb-md" v-else-if="noRequireQuestion">-->
              <!--                此问卷不包含必答题。-->
              <!--                <template v-slot:avatar>-->
              <!--                  <q-icon name="warning" color="white"/>-->
              <!--                </template>-->
              <!--              </q-banner>-->
              <!--              <q-banner dense inline-actions class="text-white bg-orange q-mb-md" v-if="voidQuestion||noOptionQuestion">-->
              <!--                <div v-if="voidQuestion">问卷中存在无标题题目</div>-->
              <!--                <div v-if="noOptionQuestion">问卷中存在无选项选择题</div>-->
              <!--                <template v-slot:avatar style="height: 100%">-->
              <!--                  <q-icon name="priority_high" color="white"/>-->
              <!--                </template>-->
              <!--              </q-banner>-->
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
                  <q-popup-edit v-model="surveyData.desc" title="编辑描述" buttons @save="changeData" persistent>
                    <q-editor v-model="surveyData.desc" dense autofocus counter @keyup.enter.stop/>
                  </q-popup-edit>
                </div>
              </div>
              <div class="column">
                <transition-group name="fade">
                  <div v-for="(question,pid) in surveyData.questionSet" :key="pid+1" class="ques-section">
                    <div v-if="question.type===0">
                      <div v-if="editing!==pid" @click="editing=pid;isEditing=true" class="editable">
                        <div class="float-right" style="padding: 1px" v-if="!validQuestion(pid)">
                          <q-icon name="error" color="red" size="25px"></q-icon>
                        </div>
                        <div class="text-h6 ques-title-large">
                          <b>{{ pid + 1|formatIndex }} / </b>
                          <span v-if="question.title!==''">{{ question.title }}</span>
                          <span v-else class="text-green-5"><i>点击编辑问题</i></span>
                          <span v-if="question.need" class="text-red"> *</span>
                        </div>
                        <q-input placeholder="请输入"
                                 :dense="true"
                                 filled
                                 v-model="answer[pid]"
                        />
                      </div>
                      <div v-else class="edit-area shadow-3">
                        <div class="text-grey-8 q-pb-md  flex justify-center text-center text-body1">
                          <q-btn round dense icon="arrow_upward" class="q-ma-sm text-primary" @click="upQuestion(pid)">
                            <q-tooltip>上移</q-tooltip>
                          </q-btn>
                          <q-btn round dense icon="arrow_downward" class="q-ma-sm text-primary"
                                 @click="downQuestion(pid)">
                            <q-tooltip>下移</q-tooltip>
                          </q-btn>
                          <q-btn round dense icon="close" class="q-ma-sm text-orange" @click="delQuestion(pid)">
                            <q-tooltip>删除</q-tooltip>
                          </q-btn>
                          <q-btn round dense icon="check" class="q-ma-sm text-secondary" @click="editing=-1">
                            <q-tooltip>完成</q-tooltip>
                          </q-btn>
                        </div>
                        <div class="text-h6 ques-title-large">
                          <b>{{ pid + 1|formatIndex }} / </b>
                          <input v-model="question.title" autofocus="autofocus" placeholder="输入问题" minlength="1"
                                 maxlength="128"
                                 class="input-title"/>
                          <span v-if="question.need" class="text-red"> *</span>
                          <div class="text-grey-8 q-gutter-xs q-mt-sm text-right text-body1 question-btn">
                            <q-checkbox label="必填项" dense class="q-mx-sm" v-model="question.need"/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="question.type===1||question.type===2">
                      <div class="editable" @click="editing=pid;isEditing=true;onAddOption=pid" v-if="editing!==pid">
                        <div class="float-right" style="padding: 1px" v-if="!validQuestion(pid)">
                          <q-icon name="error" color="red" size="25px"></q-icon>
                        </div>
                        <q-chip v-if="question.type===2" dense square class="float-right" outline color="teal-4"
                                label="多选题"/>
                        <div class="text-h6 ques-title">
                          <b>{{ pid + 1 |formatIndex }} / </b>
                          <span v-if="question.title!==''">{{ question.title }}</span>
                          <span v-else class="text-green-5"><i>点击编辑问题</i></span>
                          <span v-if="question.need" class="text-red"> *</span>

                        </div>
                        <q-field
                          borderless
                          v-model="answer[pid]"
                        >
                          <template v-slot:control>
                            <q-option-group
                              :options="question.options"
                              color="primary"
                              :type="question.type===1? 'radio':'checkbox'"
                              v-model="answer[pid]"
                              @input="answer[pid]=(question.type===1?null:[])"
                            />
                          </template>
                        </q-field>
                      </div>
                      <div v-else class="edit-area shadow-3">
                        <div class="text-grey-8 q-pb-md flex justify-center text-center text-body1">
                          <q-btn round dense icon="arrow_upward" class="q-ma-sm text-primary" @click="upQuestion(pid)">
                            <q-tooltip>上移</q-tooltip>
                          </q-btn>
                          <q-btn round dense icon="arrow_downward" class="q-ma-sm text-primary"
                                 @click="downQuestion(pid)">
                            <q-tooltip>下移</q-tooltip>
                          </q-btn>
                          <q-btn round dense icon="close" class="q-ma-sm text-deep-orange" @click="delQuestion(pid)">
                            <q-tooltip>删除</q-tooltip>
                          </q-btn>
                          <q-btn round dense icon="check" class="q-ma-sm text-secondary" @click="editing=-1">
                            <q-tooltip>完成</q-tooltip>
                          </q-btn>
                        </div>
                        <div class="text-h6 ques-title">
                          <b>{{ pid + 1 |formatIndex }} / </b>
                          <input v-model="question.title" autofocus="autofocus" placeholder="输入问题" minlength="1"
                                 maxlength="128"
                                 class="input-title"
                                 :style="{'border-color': question.title===''? '#C10015':'#1976D2'}">
                          <span v-if="question.need" class="text-red"> *</span>
                          <div class="text-grey-8 q-gutter-xs q-mt-sm text-right text-body1 question-btn">
                            <q-checkbox label="必填项" dense class="q-mx-sm" v-model="question.need"/>
                            <q-checkbox label="多选题" dense class="q-mx-sm" :value="question.type===2"
                                        @input="setMulti(pid)"/>
                          </div>
                        </div>
                        <q-list bordered>
                          <q-item-label header>选项列表</q-item-label>
                          <q-separator/>
                          <q-item v-if="question.options.length===0">
                            <div class="q-ma-sm">
                              <q-icon name="error" color="red"/>
                              <span>&nbsp;请添加选项</span>
                            </div>
                          </q-item>
                          <q-item v-for="(item,i) in question.options" :key="i">
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
                          <q-item
                            :style="{border: (onAddOption===pid)?'1px #66BB6A solid':'1px transparent solid'}"
                          >
                            <q-item-section>
                              <div>
                                <q-icon color="primary" size="12px" style="width: 25px" name="create"/>
                                <input v-model="templateOptions.label"
                                       class="input-option add-option"
                                       placeholder="在此添加选项" @keyup.enter="addOption(pid)" @focus="onAddOption=pid"
                                       @blur="onAddOption=-1"/>
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
                </transition-group>
              </div>
              <q-space style="height: 100px"/>
              <q-btn-group spread outline class="q-mt-lg shadow-3 edit-toolbox" stretch>
                <q-btn label="选择题" stack icon="check_box" @click="addChoiceQuestion"/>
                <q-btn label="填空题" stack icon="question_answer" @click="addBlankQuestion"/>
                <q-btn label="预览" stack icon="visibility" @click="paperSimulate=true"/>
                <q-btn label="保存" stack icon="save" @click="onSave"/>
              </q-btn-group>

            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="send" class="column">
        <div style="max-width: calc(100vw - 32px);">
          <q-banner v-if="!surveyData.running" class="bg-grey-3" rounded style="margin-bottom: 10px">
            <template v-slot:avatar>
              <q-icon name="speaker_notes_off" color="primary"/>
            </template>
            当前问卷已<span class="text-red-7 text-bold">停止收集</span>，受访者无法填写问卷。
            <template v-slot:action>
              <q-btn flat color="primary" icon="play_arrow" @click="surveyData.running=true;onSave()" label="开始收集问卷"/>
            </template>
          </q-banner>
          <q-banner v-if="!surveyData.open" class="bg-primary text-white" rounded>
            <template v-slot:avatar>
              <q-icon name="group_add"/>
            </template>
            此问卷是<b>定向问卷</b>，请选择在列表在选择受访者。系统会为您选择的受访者生成单次有效的私密链接，并通过电子邮件发送。
            <template v-slot:action>
              <!--              <q-btn flat color="white" @click="routeTo('/manage/respondents')" label="管理受访者↗"/>-->
              <q-btn flat color="white" @click="tab='setting'" label="改变问卷访问权限"/>
            </template>
          </q-banner>
          <q-banner v-else class="bg-secondary text-white" rounded>
            <template v-slot:avatar>
              <q-icon name="wifi_tethering"/>
            </template>
            此问卷是<b>开放问卷</b>，可使用如下链接匿名作答。
            <div v-if="!surveyData.running" class="text-grey-3 text-italic">* 问卷暂停回收，链接仅提供预览，答题结果不会记录</div>
            <q-card class="q-mt-sm q-pa-md text-center text-italic" style="max-width: 100vw" flat>
              <a :href="openLink" target="_blank" class="q-link text-blue-7">
                <span style="word-wrap: anywhere;word-break: break-all">
                {{ openLink }}
                </span>
              </a>
            </q-card>
            <template v-slot:action>
              <!--              <q-btn flat color="white" @click="routeTo('/manage/respondents')" label="管理受访者↗"/>-->
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
                  <q-btn color="secondary" flat class="q-mr-md" @click="routeTo('/manage/respondents')" label="管理受访者↗"/>
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
                      <div class="text-h5 text-blue-7">{{ resultData.frequency ? resultData.frequency : '0' }}</div>
                      <div>已收集问卷数</div>
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
                <div v-for="(question,pid) in resultData.questionSet" :key="pid" class="ques-section">
                  <div v-if="question.type===0">
                    <div>
                      <div class="text-h6 ques-title-large">
                        <b>{{ pid + 1|formatIndex }} / </b>
                        <span v-if="question.title!==''">{{ question.title }}</span>
                        <span v-else class="text-green-5"><i>无标题</i></span>
                        <span v-if="question.need" class="text-red"> *</span>
                      </div>
                      <q-list bordered separator
                              v-if="showAllAns[pid]!==true">
                        <q-item v-for="(ans,i) in previewList(question.answer)" :key="i">
                          <q-item-section>{{ Object.keys(ans)[0] }}</q-item-section>
                          <q-item-section side>
                            <div class="text-grey-8 q-gutter-xs">
                              ×{{ Object.values(ans)[0] }}
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-item v-if="!question.frequency || question.frequency===0">
                          <div class="q-ma-sm">
                            <q-icon name="warning"/>
                            <span>&nbsp;&nbsp;暂无作答</span>
                          </div>
                        </q-item>
                        <q-item clickable @click="switchShow(pid)" v-if="question.answer.length>5">
                          <q-item-section class="text-center text-primary">显示全部</q-item-section>
                        </q-item>
                      </q-list>
                      <q-list bordered separator v-else>
                        <q-item v-for="(ans,i) in question.answer" :key="i">
                          <q-item-section>{{ Object.keys(ans)[0] }}</q-item-section>
                          <q-item-section side>
                            <div class="text-grey-8 q-gutter-xs">
                              ×{{ Object.values(ans)[0] }}
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-item v-if="!question.frequency || question.frequency===0">
                          <div class="q-ma-sm">
                            <q-icon name="warning"/>
                            <span>&nbsp;&nbsp;暂无作答</span>
                          </div>
                        </q-item>
                        <q-item clickable @click="switchShow(pid)">
                          <q-item-section class="text-center text-primary">收起</q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                  <div v-else-if="question.type===1||question.type===2">
                    <div>
                      <q-chip v-if="question.type===2" dense square class="float-right" style="margin: 6px" outline color="teal-4"
                              label="多选题"/>
                      <q-chip v-if="question.type===1" dense square class="float-right" style="margin: 6px" outline color="light-blue-6"
                              label="单选题"/>
                      <div class="text-h6 ques-title">
                        <b>{{ pid + 1 |formatIndex }} / </b>
                        <span v-if="question.title!==''">{{ question.title }}</span>
                        <span v-else class="text-green-5"><i>无标题</i></span>
                        <span v-if="question.need" class="text-red"> *</span>

                      </div>
                      <q-list bordered separator>
                        <q-item v-for="(option,i) in question.options" :key="i">
                          <q-item-section>
                            {{ option.label }}
                            <q-linear-progress
                              :value="question.frequency&&question.answer? ((option.label in question.answer)?question.answer[option.label]:0)/question.frequency:0"/>
                          </q-item-section>
                          <q-item-section side>
                            <div class="text-grey-8 q-gutter-xs">
                              {{ option.label in question.answer ? question.answer[option.label] : '0' }}
                            </div>
                          </q-item-section>
                        </q-item>
                        <q-item v-if="question.options.length===0">
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
              <q-item-section>发布问卷
                <span class="text-grey">
                  {{ surveyData.running ? '允许作答' : '停止收集问卷' }}</span>
              </q-item-section>
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-toggle v-model="surveyData.running" @input="onSave"/>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>问卷类型
                <span class="text-grey">
                {{ surveyData.open ? "开放问卷 (收到链接者均可作答)" : "定向问卷 (仅受邀用户可以作答)" }}</span>
              </q-item-section>
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
import Vue from "vue";

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
        questionSet: []
      },
      answer: [],
      editing: null,
      respondentData: [],
      id: this.$route.params.id,
      selected: [],
      columns: [
        {
          name: 'sid',
          required: true,
          label: '学号/工号',
          field: 'sid',
          sortable: true
        },
        {name: 'name', label: '姓名', field: 'name', sortable: true},
        {name: 'school', label: '学校', field: 'school', sortable: true},
        {name: 'sex', label: '性别', field: 'sex'},
        {name: 'phone', label: '手机号', field: 'phone'},
        {name: 'email', label: '邮箱', field: 'email'},
        {
          name: 'status', label: '状态', field: 'status', format: val => {
            if (this.surveyData.open) return "-"
            return val === false ? "未发送" : "已发送"
          }
        },
      ],
      isEditing: false,
      openLink: null,
      resultData: {
        frequency: '-',
        questionSet: [],
        desc: "",
        id: "",
        open: null,
        respondent_ids: [],
        startTime: null
      },
      onAddOption: null,
      showAllAns: []
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
    },
    voidSurvey() {
      return this.surveyData.questionSet.length === 0
    },
    voidQuestion() {
      for (let i = this.surveyData.questionSet.length - 1; i >= 0; --i) {
        if (this.surveyData.questionSet[i].title === '') return true
      }
      return false
    },
    noRequireQuestion() {
      for (let i = this.surveyData.questionSet.length - 1; i >= 0; --i) {
        if (this.surveyData.questionSet[i].need) return false
      }
      return true
    },
    noOptionQuestion() {
      for (let i = this.surveyData.questionSet.length - 1; i >= 0; --i) {
        if (this.surveyData.questionSet[i].type === 1 && this.surveyData.questionSet[i].options.length === 0) return true
      }
      return false
    }
  },
  methods: {
    setMulti(pid) {
      if (this.surveyData.questionSet[pid].type === 2) {
        this.surveyData.questionSet[pid].type = 1
        this.answer[pid] = null
      } else {
        this.surveyData.questionSet[pid].type = 2
        this.answer[pid] = []
      }
    },
    switchShow(pid) {
      Vue.set(this.showAllAns, pid, !this.showAllAns[pid])
    },
    previewList(list) {
      if (!Array.isArray(list)) return null
      return list.slice(0, 5)
    },
    validQuestion(pid) {
      if (this.surveyData.questionSet[pid].type === 0) {
        if (this.surveyData.questionSet[pid].title === '') return false
      } else {
        if (this.surveyData.questionSet[pid].title === '') return false
        if (this.surveyData.questionSet[pid].options.length === 0) return false
      }
      return true
    },
    async getResponse() {
      const res = await getSurveyResult({id: this.id})
      this.resultData = res.data.data
      this.resultData.questionSet.sort((a, b) => {
        return a.index > b.index ? 1 : -1
      })
      for (let i = this.resultData.questionSet.length - 1; i >= 0; --i) {
        this.showAllAns.push(false)
        if (this.resultData.questionSet[i].type === 0)
          this.resultData.questionSet[i].answer.sort((a, b) => {
            return Object.values(a)[0] < Object.values(b)[0] ? 1 : -1
          })
      }
    },
    switchStime() {

    },
    upQuestion(pid) {
      if (pid) {
        const t = this.surveyData.questionSet[pid - 1].index
        this.surveyData.questionSet[pid - 1].index = this.surveyData.questionSet[pid].index
        this.surveyData.questionSet[pid].index = t
        this.sortQuestions()
        --this.editing
      }
    }
    ,
    downQuestion(pid) {
      if (pid + 1 !== this.surveyData.questionSet.length) {
        const t = this.surveyData.questionSet[pid].index
        this.surveyData.questionSet[pid].index = this.surveyData.questionSet[pid + 1].index
        this.surveyData.questionSet[pid + 1].index = t
        this.sortQuestions()
        ++this.editing
      }
    }
    ,
    delQuestion(pid) {
      console.log(pid)
      for (let i = pid; i < this.surveyData.questionSet.length - 1; ++i) {
        this.surveyData.questionSet[i] = this.surveyData.questionSet[i + 1]
        this.surveyData.questionSet[i].index = i + 1
      }
      this.editing = -1
      this.surveyData.questionSet.splice(this.surveyData.questionSet.length - 1, 1)
    }
    ,
    upOption(pid, oid) {
      if (oid > 0) {
        const t = this.surveyData.questionSet[pid].options[oid - 1].value
        this.surveyData.questionSet[pid].options[oid - 1].value = this.surveyData.questionSet[pid].options[oid].value
        this.surveyData.questionSet[pid].options[oid].value = t
        this.surveyData.questionSet[pid].options.sort((a, b) => {
          return a.value < b.value ? 1 : -1
        })
      }
    }
    ,
    downOption(pid, oid) {
      if (this.surveyData.questionSet[pid].options.length > oid + 1) {
        const t = this.surveyData.questionSet[pid].options[oid + 1].value
        this.surveyData.questionSet[pid].options[oid + 1].value = this.surveyData.questionSet[pid].options[oid].value
        this.surveyData.questionSet[pid].options[oid].value = t
        this.surveyData.questionSet[pid].options.sort((a, b) => {
          return a.value < b.value ? 1 : -1
        })
      }
    }
    ,
    delOption(pid, oid) {
      for (let i = oid; i < this.surveyData.questionSet[pid].options.length - 1; ++i) {
        this.surveyData.questionSet[pid].options[i] = this.surveyData.questionSet[pid].options[i + 1]
      }
      this.surveyData.questionSet[pid].options.splice(this.surveyData.questionSet[pid].options.length - 1, 1)
    }
    ,
    addOption(pid) {
      for (let i = this.surveyData.questionSet[pid].options.length - 1; i >= 0; --i) {
        if (this.surveyData.questionSet[pid].options[i].label === this.templateOptions.label) {
          Notify.create({message: "选项重复，已合并", color: 'secondary', position: 'top', timeout: 1500})
          this.templateOptions.label = ""
          return
        }
      }
      this.surveyData.questionSet[pid].options.push({
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
        case "edit":
          this.getSurveyData()
          break;
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
    sortQuestions() {
      this.surveyData.questionSet.sort((a, b) => {
        return a.index > b.index ? 1 : -1
      })
    }
    ,
    async getSurveyData() {
      const res = await getSurveyItem({id: this.id})
      if (res.data.code !== 0) {
        await this.$router.push('/manage')
        return
      }
      this.surveyData = res.data.data
      this.sortQuestions()
      for (let i = 0; i < this.surveyData.questionSet.length; i++) {
        this.answer.push(this.surveyData.questionSet[i].type === 2 ? [] : null)
        if (this.surveyData.questionSet[i].type === 1) {
          this.surveyData.questionSet[i].options.sort((a, b) => {
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
      window.scrollBy(0, document.body.scrollHeight)
      this.surveyData.questionSet.push({
          type: 1,
          index: this.surveyData.questionSet.length + 1,
          need: false,
          title: "",
          desc: "",
          options: [],
        }
      )
    }
    ,
    addBlankQuestion() {
      this.surveyData.questionSet.push({
        type: 0,
        index: this.surveyData.questionSet.length + 1,
        need: false,
        title: "",
        desc: ""
      },)
      setTimeout(() => {
        window.scrollBy(0, document.body.scrollHeight)
      }, 100)
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

.fade-enter-active, .fade-leave-active {
  transition: all .8s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.edit-toolbox {
  position: fixed;
  bottom: 60px;
  left: max(5vw, calc(50vw - 400px));
  width: min(90vw, 800px);
  max-width: 100%;
  background-color: #fffffff0;
}

.edit-area {
  margin: 20px -20px;
  padding: 20px;
  border-radius: 4px;
  animation: bounce-in 0.2s ease-in-out;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    padding: 10px;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    padding: 20px;
    transform: scale(1);
  }
}
</style>
