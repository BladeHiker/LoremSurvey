<template>
  <q-page class="main-con">
    <div class="column">
      <div class="paper-header">
        <div class="text-h4 text-center paper-title">问卷标题{{ $route.params.token }}</div>
        <div class="text-center paper-time">2020/1/1~2021/12/31</div>
        <br>
        <div class="text-center">问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字</div>
      </div>
      <div v-for="(problem,i) in problemSet" :key="i" class="ques-section">
        <div v-if="problem.type===0">
          <div class="text-h6 ques-title">
            <b>{{ problem.index }}/ </b>
            <span>{{ problem.title }}</span>
            <span v-if="problem.need"> *</span>
            <q-input label="请输入" outlined v-model="answer[i]"></q-input>
          </div>
        </div>
        <div v-else-if="problem.type===1">
          <div class="text-h6 ques-title">
            <b>{{ problem.index }}/ </b>
            <span>{{ problem.title }}</span>
            <span v-if="problem.need"> *</span>
          </div>
          <q-option-group
            v-model="answer[i]"
            :options="problem.options"
            color="primary"
            type="radio"
          />
        </div>
      </div>

      <q-btn
        label="提交"
        color="primary"
        @click="submit"
        class="flex-center submit-btn"
      />
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
              value: 'op1'
            },
            {
              label: 'Option 2',
              value: 'op2'
            },
            {
              label: 'Option 3',
              value: 'op3'
            }
          ],

        }],
      answer: [],
      group:
        '',
    }
  },
  created() {
    //鉴权
  },
  methods: {
    submit() {
      Notify.create(this.answer.toString())
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
