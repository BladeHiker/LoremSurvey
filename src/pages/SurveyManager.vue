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
          <q-btn flat color="primary" icon-right="arrow_forward">
            创建问卷
          </q-btn>
        </div>
      </div>
      <div class="flex row surveys">
        <q-card v-for="(item,i) in surveyList" v-bind:key="i" class="survey-item">
          <q-card-section class="survey-top text-white" :class="'bg-'+ colorList[i*7%6]">
            <div class="text-h6">{{ item.name }}</div>
            <div class="text-subtitle2" v-if="item.isOpen">
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
            <q-btn flat color="red">删除</q-btn>
          </q-card-actions>
        </q-card>
        <q-btn icon="add_circle_outline" size="80px" dense text-color="grey-4" class="survey-item"></q-btn>
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
export default {
  name: "SurveyManager",
  data() {
    return {
      surveyList: [
        {id: 1, name: "软件工程调查问卷", isOpen: true},
        {id: 1, name: "问卷标题", isOpen: true},
        {id: 2, name: "问卷标题", isOpen: false},
        {id: 1, name: "问卷标题", isOpen: false},
        {id: 2, name: "问卷标题", isOpen: false},
        {id: 2, name: "问卷标题", isOpen: false},
        {id: 2, name: "问卷标题", isOpen: false},
      ],
      colorList: ['primary', 'secondary', 'accent', 'positive', 'info', 'warning']
    }
  },
  methods: {
    routeTo(url) {
      this.$router.push(url)
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
  word-break: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}

.survey-top {
  height: 160px;
  text-shadow: 3px 2px 11px #2d2d2da3;
}


.manager-header div {
  margin-bottom: 10px;
}


.main-btn-group {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}

.survey-void {
  width: 270px;
}
</style>
