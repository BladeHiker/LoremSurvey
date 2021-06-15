<template>
  <q-page class="flex column content-center">
    <div class="main-btn-group">
      <q-btn flat color="primary" icon-right="arrow_forward"
             @click="routeTo('/manage/respondents')">
        受访者管理
      </q-btn>
      <q-btn flat color="primary" icon-right="arrow_forward" @click="onCreateSurvey">
        创建问卷
      </q-btn>
    </div>
    <div class="work-area">
      <!--      <div class="manager-header">-->
      <!--        <div class="text-h3">-->
      <!--          问卷管理-->
      <!--        </div>-->
      <!--        <q-separator color="black"></q-separator>-->
      <!--        <div class="main-btn-group">-->
      <!--          <q-btn flat color="primary" icon-right="arrow_forward"-->
      <!--                 @click="routeTo('/manage/respondents')">-->
      <!--            受访者管理-->
      <!--          </q-btn>-->
      <!--          <q-btn flat color="primary" icon-right="arrow_forward" @click="onCreateSurvey">-->
      <!--            创建问卷-->
      <!--          </q-btn>-->
      <!--        </div>-->
      <!--      </div>-->

      <div class="flex row surveys">
        <q-card v-for="(item,i) in surveyList" v-bind:key="i" class="survey-item">
          <q-card-section class="survey-top text-white"
                          :class="'bg-'+ colorList[(item.id.charCodeAt(item.id.length-1)*item.id.charCodeAt(item.id.length-2))*37%6]"
                          @click="routeTo('manage/edit/'+item.id)">
            <div class="text-h6">
              <div>{{ item.title }}</div>
              <div class="text-subtitle2">
                {{ item.open ? '开放问卷' : "定向问卷" }}
              </div>
            </div>

            <div class="text-subtitle2" v-if="item.running">
              <q-icon name="fiber_manual_record" color="light-green"></q-icon>
              收集中
            </div>
            <div class="text-subtitle2" v-else>
              <q-icon name="fiber_manual_record" color="red"></q-icon>
              停止收集
            </div>
            <q-icon name="description" style="opacity: 0.5" size="100px" class="absolute-bottom-right"/>
          </q-card-section>
          <q-separator dark/>
          <q-card-actions>
            <q-btn flat color="primary" @click="routeTo('manage/edit/'+item.id)">管理</q-btn>
            <q-btn flat color="red" @click="ondeleteSurvey(item.id)">删除</q-btn>
          </q-card-actions>
        </q-card>
        <q-btn icon="add_circle_outline" @click="onCreateSurvey" size="80px" dense text-color="grey-4"
               class="survey-item"></q-btn>
        <div class="survey-void"></div>
        <div class="survey-void"></div>
        <div class="survey-void"></div>
        <div class="survey-void"></div>
        <div class="survey-void"></div>
      </div>
      <q-dialog v-model="addDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">选择问卷类型</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-btn-toggle
              v-model="surveyOpen"
              toggle-color="primary"
              :options="[{value: true, slot: 'one'},{value: false, slot: 'two'},]"
            >
              <template v-slot:one>
                <div class="row items-center no-wrap q-py-md">
                  <div class="text-center">
                    <b class="text-h5">开放问卷</b>
                    <hr/>
                    <div>
                      受访者通过问卷链接匿名做答
                      <br/>
                      <br/>
                      问卷链接多次有效
                    </div>
                  </div>
                </div>
              </template>

              <template v-slot:two>
                <div class="row items-center no-wrap q-py-md">
                  <div class="text-center">
                    <b class="text-h5">定向问卷</b>
                    <hr/>
                    <div>
                      受访者通过私密链接实名作答
                      <br/>
                      <br/>
                      问卷链接单次有效
                    </div>
                  </div>
                </div>
              </template>
            </q-btn-toggle>
            <div class="q-mt-md"> * 问卷类型可以在创建后切换</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" color="primary" v-close-popup/>
            <q-btn flat label="创建" color="primary" @click="createSurvey" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import {createSurveyItem, deleteSurveyItem, getSurveyList} from "src/api/surveyAdmin";

export default {
  name: "SurveyManager",
  data() {
    return {
      surveyList: [],
      addDialog: false,
      surveyOpen: true,
      colorList: ['primary', 'secondary', 'accent', 'positive', 'info', 'warning']
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getSurveyList().then(res => {
        this.surveyList = res.data.data
      })
    },
    routeTo(url) {
      this.$router.push(url)
    },
    onCreateSurvey() {
      this.surveyOpen = true
      this.addDialog = true
    },
    createSurvey() {
      createSurveyItem({
        open: this.surveyOpen,
        running: false,
        title: "无标题问卷",
        startTime: null,
        stopTime: null,
        desc: "",
        questionSet: [],
        emailTemplate: ""
      }).then(res => {
        this.routeTo('manage/edit/' + res.data.data.id)
      })
    },
    ondeleteSurvey(i) {
      this.$q.dialog({
        title: '删除',
        message: '确定要删除此问卷吗? 此操作不可逆',
        cancel: true,
        persistent: true
      }).onOk(() => {
        deleteSurveyItem({id: i}).then(() => {
          this.getData()
        })
      })
    }
  }
}
</script>

<style scoped>
.survey-item {
  width: 300px;
  height: 215px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.survey-item:hover {
  transform: scale(1.01);
}

.survey-item:active {
  transform: scale(0.99);
}

.surveys {
  justify-content: space-around;
}

.survey-item .text-h6 {
  height: 115px;
  text-overflow: ellipsis;
  overflow: hidden;
  /*word-break: normal;*/
  /*display: -webkit-box;*/
  /*-webkit-line-clamp: 2;*/
}

.survey-top {
  cursor: pointer;
  height: 160px;
  text-shadow: 3px 2px 11px #2d2d2da3;
}


.manager-header div {
  margin-bottom: 10px;
}


.survey-void {
  width: 300px;
  margin-right: 10px;
}

@media (max-width: 690px) {
  .survey-item {
    width: 80vw;
    margin-right: 0;
  }

  .survey-void {
    width: 80vw;
    margin-right: 0;
  }
}
</style>
