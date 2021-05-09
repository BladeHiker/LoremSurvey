<template>
  <q-page>
    <q-scroll-area :thumb-style="thumbStyle"
                   :bar-style="barStyle" class="main-con">
      <div class="column">
        <div class="paper-header">
          <div class="text-h4 text-center paper-title">问卷标题{{ $route.params.token }}</div>
          <div class="text-center paper-time">2020/1/1~2021/12/31</div>
          <br>
          <div class="text-center">问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字,问卷说明文字</div>
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>01/ </b><span>问题xxx</span></div>
          <q-input label="请输入" outlined></q-input>
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>02/ </b><span>问题xxx</span></div>
          <q-input label="请输入" outlined></q-input>
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>03/ </b><span>问题xxx</span></div>
          <q-input label="请输入" outlined></q-input>
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>04/ </b><span>问题xxx</span></div>
          <q-input label="请输入" outlined></q-input>
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>05/ </b><span>问题xxx</span></div>
          <q-input label="请输入" outlined></q-input>
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>06/ </b><span>问题xxx</span></div>
          <q-input label="请输入" outlined></q-input>
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>07/ </b><span>单选题xxx</span></div>
          <q-option-group
            v-model="group"
            :options="options"
            color="primary"
            type="radio"
          />
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>08/ </b><span>问题xxx</span></div>
          <q-input label="请输入" outlined></q-input>
        </div>
        <div class="ques-section">
          <div class="text-h6 ques-title"><b>09/ </b><span>问题xxx</span></div>
          <q-input label="请输入" outlined></q-input>
        </div>
        <q-btn
          label="提交"
          color="primary"
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
    </q-scroll-area>

  </q-page>
</template>

<script>

export default {
  name: "survey",
  data() {
    return {
      group: '',
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
      thumbStyle: {
        right: '0px',
        backgroundColor: '#027be3',
        width: '3px',
        opacity: 0.75
      },
      barStyle: {
        right: '0px',
        backgroundColor: '#027be3',
        width: '3px',
        opacity: 0.2
      }
    }
  },
  created() {
    //鉴权
  },
  methods: {}
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
  height: 100vh;
  padding: 30px;
  background-color: #ffffff;
  overflow: hidden;
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
