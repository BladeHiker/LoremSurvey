<template>
  <q-page class="flex justify-center">
    <div class="work-area">
      <div class="manager-header">
        <div class="text-h3">
          问卷管理
        </div>
        <q-separator color="black"></q-separator>
        <div class="main-btn-group">
          <q-btn flat color="primary" icon-right="arrow_forward"
                 @click="routeTo('/manage/respondents')">
            受访者管理
          </q-btn>
          <q-btn flat color="primary" icon-right="arrow_forward" @click="onCreateSurvey">
            创建问卷
          </q-btn>
        </div>
      </div>
      <div class="flex row surveys">
        <q-card v-for="(item,i) in surveyList" v-bind:key="i" class="survey-item">
          <q-card-section class="survey-top text-white" :class="'bg-'+ colorList[i*7%6]">
            <div class="text-h6">
              <div>{{ item.title }}</div>
              <div class="text-subtitle2">
                {{ item.isopen ? '开放问卷' : "定向问卷" }}
              </div>
            </div>

            <div class="text-subtitle2" v-if="item.isrunning">
              <q-icon name="fiber_manual_record" color="light-green"></q-icon>
              收集中
            </div>
            <div class="text-subtitle2" v-else>
              <q-icon name="fiber_manual_record" color="red"></q-icon>
              停止收集
            </div>
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
      createSurveyItem({
        isopen: false,
        isrunning: false,
        title: "无标题问卷",
        stime: null,
        etime: null,
        desc: "",
        problemSet: [],
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
        deleteSurveyItem({id: i})
        this.getData()
      })
    }
  }
}
</script>

<style scoped>
.survey-item {
  width: 270px;
  height: 215px;
  margin-bottom: 20px;
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
  height: 160px;
  text-shadow: 3px 2px 11px #2d2d2da3;
}


.manager-header div {
  margin-bottom: 10px;
}


.survey-void {
  width: 270px;
}
</style>
