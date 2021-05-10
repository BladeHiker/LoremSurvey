<template>
  <q-page class="main-con">
    <div>
      <div class="paper-header">
        <div class="text-h4 text-center paper-title">问卷标题{{ $route.params.token }}</div>
        <div class="text-center paper-time">2020/1/1~2021/12/31</div>
        <br>
        <div class="text-center">问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字</div>
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
        <div v-for="(problem,i) in problemSet" :key="i" class="ques-section">
          <div v-if="problem.type===0">
            <div class="text-h6 ques-title">
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
              :rules="[val => !problem.need||val!=null||'必填项']">
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
          color="primary"
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

export default {
  name: "survey",
  data() {
    return {
      problemSet: [
        {
          type: 0,
          index: 1,
          need: true,
          title: "填空题示例",
        },
        {
          type: 0,
          index: 2,
          need: false,
          title: "填空题示例",
        },
        {
          type: 1,
          index: 3,
          need: true,
          title: "选择题示例",
          options: [
            {
              label: 'Option 1',
              value: 'A'
            },
            {
              label: 'Option 2',
              value: 'B'
            },
            {
              label: 'Option 3',
              value: 'C'
            }
          ],
        },
        {
          type: 1,
          index: 4,
          need: false,
          title: "选择题示例",
          options: [
            {
              label: 'Option 1',
              value: 'A'
            },
            {
              label: 'Option 2',
              value: 'B'
            },
            {
              label: 'Option 3',
              value: 'C'
            }
          ],
        }
      ],
      answer: [],
      submitted: 0,
    }
  },
  created() {
    //鉴权
  },
  filters: {
    formatIndex: function (index) {
      if (index < 10) return '0' + index
      return index
    }
  },
  methods: {
    submit() {
      Notify.create(this.answer.toString())
      this.submitted = -1
      setTimeout(() => {
        this.submitted = 1
      }, 1000)
    },
    validError() {
      Notify.create("存在未填项")
    }
  }
}
</script>

<style scoped>
.paper-header {
  padding-top: 50px;
  padding-bottom: 20px;
}

.paper-title {

}

.paper-time {
  color: #aaa;
}

.main-con {
  width: min(100vw, 800px);
  padding: 30px;
  background-color: #ffffff;
  overflow-x: hidden;
}

.ques-title {
  margin-bottom: 8px;
}

.ques-section {
  margin: 20px 0;
}

.submit-btn {
}

.paper-footer {
  height: 80px;
  padding: 20px;
}
</style>
