<template>
  <div>
    <!--    <q-btn-group spread flat>-->
    <!--      <q-btn label="选择题" icon="add"/>-->
    <!--      <q-btn label="填空题" icon="add"/>-->
    <!--      <q-btn label="预览" icon="visibility" @click="paperSimulate=true"/>-->
    <!--    </q-btn-group>-->
    <!--    <div class="column flex-center">-->
    <!--      <div class="san-grail">-->
    <!--        <div class="q-ma-lg">-->
    <!--          <div class="paper-header">-->
    <!--            <div class="text-h4 editable text-center paper-title">-->
    <!--              {{ surveyData.title }}-->
    <!--              <q-popup-edit v-model="surveyData.title" title="编辑标题" buttons>-->
    <!--                <q-input v-model="surveyData.title" placeholder="请输入问卷标题" maxlength="50" dense autofocus counter/>-->
    <!--              </q-popup-edit>-->
    <!--            </div>-->
    <!--            <br>-->
    <!--            <div class="text-center editable">-->
    <!--              <div v-html="surveyData.desc"></div>-->
    <!--              <q-popup-edit v-model="surveyData.desc" title="编辑描述" buttons>-->
    <!--                <q-editor v-model="surveyData.desc" dense autofocus counter/>-->
    <!--              </q-popup-edit>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="column">-->
    <!--            <div v-for="(question,i) in surveyData.questionSet" :key="i" class="ques-section">-->
    <!--              <div v-if="question.type===0">-->
    <!--                <div>-->
    <!--                  <div class="text-h6 ques-title-large">-->
    <!--                    <b>{{ i + 1|formatIndex }} / </b>-->
    <!--                    <span>{{ question.title }}</span>-->
    <!--                    <span v-if="question.need" class="text-red"> *</span>-->
    <!--                  </div>-->
    <!--                  <q-input placeholder="请输入"-->
    <!--                           disable-->
    <!--                           :dense="true"-->
    <!--                           filled-->
    <!--                           v-model="answer[i]"-->
    <!--                  />-->
    <!--                </div>-->
    <!--              </div>-->
    <!--              <div v-else-if="question.type===1">-->
    <!--                <div class="text-h6 ques-title">-->
    <!--                  <b>{{ i + 1 |formatIndex }} / </b>-->
    <!--                  <span>{{ question.title }}</span>-->
    <!--                  <span v-if="question.need" class="text-red"> *</span>-->
    <!--                </div>-->
    <!--                <q-field-->
    <!--                  v-model="answer[i]"-->
    <!--                  borderless-->
    <!--                  disable-->
    <!--                >-->
    <!--                  <template v-slot:control>-->
    <!--                    <q-option-group-->
    <!--                      v-model="answer[i]"-->
    <!--                      :options="question.options"-->
    <!--                      color="primary"-->
    <!--                      type="radio"-->
    <!--                    />-->
    <!--                  </template>-->
    <!--                </q-field>-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "SurveyEdit",
  data() {
    return {}
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

.paper-header .editable:hover::after {
  content: "单击编辑";
  font-size: small;
  color: #26A69A;
  position: absolute;
  text-align: center;
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
</style>
